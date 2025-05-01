import { useState, useEffect, useRef, useCallback } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Search, Send, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import profile from "../../assets/icon/profile.svg";
import { Header } from "../common/Header";
import { useNavigate } from "react-router-dom";

// Define types
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: "text" | "image";
  status?: "sending" | "sent" | "delivered" | "read" | "error";
}

interface Contact {
  id: number;
  name: string;
  profilePicture?: string;
  organisation?: string;
  department?: string;
  online?: boolean;
  lastSeen?: string;
  isFollower?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// Constants
const API_BASE_URL = "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev";
const WS_ENDPOINT = "wss://skixu4rpa4.execute-api.ap-south-1.amazonaws.com/production/";

function MessagesMainV2() {
  // State
  const [currentUserId] = useState<string | null>(localStorage.getItem('Id'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFollowersList, setShowFollowersList] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isMessageSending, setIsMessageSending] = useState<boolean>(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache'
    };
  }, []);

  // Fetch contacts
  useEffect(() => {
    if (!currentUserId) return;
    
    console.log('Fetching contacts...');
    
    setIsLoadingContacts(true);
    
    fetch(`${API_BASE_URL}/messaging/contacts/${currentUserId}`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const formattedContacts = data.data.map((contact: any) => ({
  id: contact.id,
  name: contact.name,
  profilePicture: contact.profilePicture,
  organisation: contact.organisation,
  department: contact.department,
  online: contact.online,
  lastSeen: contact.lastSeen,
  // Robust normalization for isFollower
  isFollower: contact.isFollower === true || contact.isFollower === 1 || contact.isFollower === "true",
  lastMessage: contact.lastMessage || '',
  lastMessageTime: contact.lastMessageTime ? 
    new Date(contact.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
  unreadCount: contact.unreadCount || 0
}));
          
          setContacts(formattedContacts);
        } else {
          setContactsError('Failed to fetch contacts');
        }
      })
      .catch(err => {
        console.error('Error fetching contacts:', err);
        setContactsError('Network error');
      })
      .finally(() => {
        setIsLoadingContacts(false);
      });
  }, [currentUserId, getAuthHeaders]);

  // Set up WebSocket connection with backoff strategy
  useEffect(() => {
    if (!currentUserId) return;
    
    console.log('Setting up WebSocket connection...');
    
    // Constants for reconnection logic
    const MAX_RECONNECT_ATTEMPTS = 5;
    
    const connectWebSocket = () => {
      // Prevent reconnection if too many attempts
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Stopping reconnection.`);
        return;
      }

      // Close any existing connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      // Calculate exponential backoff delay
      const backoffDelay = reconnectAttemptsRef.current === 0 ? 0 : 
        Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // Max 30 second delay
      
      if (reconnectAttemptsRef.current > 0) {
        console.log(`Reconnection attempt ${reconnectAttemptsRef.current} of ${MAX_RECONNECT_ATTEMPTS}. Waiting ${backoffDelay}ms...`);
      }
      
      // Clear any existing timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Delay reconnection based on attempt count (except for first attempt)
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Connecting to WebSocket endpoint: ${WS_ENDPOINT}?userId=${currentUserId}`);
        
        // Create a new WebSocket connection
        const socket = new WebSocket(`${WS_ENDPOINT}?userId=${currentUserId}`);
        wsRef.current = socket;
        
        // Connection opened
        socket.onopen = () => {
          console.log('WebSocket connection established successfully');
          setWsConnected(true);
          setWs(socket);
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
          
          // Register with the server
          try {
            socket.send(JSON.stringify({
              action: 'register',
              userId: currentUserId
            }));
            console.log('Registration message sent to server');
          } catch (error) {
            console.error('Error sending registration message:', error);
          }
        };
        
        // Handle incoming messages
        socket.onmessage = (event) => {
          try {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);
            
            if (data.type === 'message') {
              handleIncomingMessage(data.data);
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
        
        // Handle connection close
        socket.onclose = (event) => {
          console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
          setWsConnected(false);
          setWs(null);
          
          // Increment reconnect attempts
          reconnectAttemptsRef.current += 1;
          
          // Only attempt to reconnect if it wasn't a clean close
          if (event.code !== 1000) {
            console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current}...`);
            connectWebSocket();
          } else {
            console.log('Clean WebSocket close, not attempting to reconnect');
          }
        };
        
        // Handle errors
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
          // Don't close the socket here - the onclose handler will be called automatically
        };
      }, backoffDelay);
    };
    
    // Initial connection
    connectWebSocket();
    
    // Clean up function
    return () => {
      console.log('Cleaning up WebSocket resources');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current) {
        // Use a clean close code to signal intentional closure
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, [currentUserId]);

  // Handle incoming messages
  const handleIncomingMessage = useCallback((messageData: any) => {
    if (!messageData || !messageData.id) {
      console.error('Invalid message received:', messageData);
      return;
    }
    
    // Format the received message
    const processedMessage: Message = {
      id: messageData.id,
      senderId: String(messageData.senderId),
      receiverId: String(messageData.receiverId),
      content: messageData.content || '',
      timestamp: messageData.timestamp || new Date().toISOString(),
      type: messageData.type || 'text',
      status: 'delivered'
    };
    
    // Check if current user is sender or receiver
    const isCurrentUserSender = String(processedMessage.senderId) === String(currentUserId);
    const isCurrentUserReceiver = String(processedMessage.receiverId) === String(currentUserId);
    
    // Add or update message in our state
    setMessages(prevMessages => {
      // First check if this is a confirmation of a message we already sent
      // Look for messages with similar content sent by the current user recently
      if (isCurrentUserSender) {
        // Find messages that match by content+sender+receiver (regardless of ID)
        const existingMessageIndex = prevMessages.findIndex(msg => 
          msg.senderId === processedMessage.senderId &&
          msg.receiverId === processedMessage.receiverId &&
          msg.content === processedMessage.content &&
          // Only look for messages sent within the last minute
          Math.abs(new Date(msg.timestamp).getTime() - new Date(processedMessage.timestamp).getTime()) < 60000 &&
          // Only update messages still marked as 'sending' or 'sent'
          (msg.status === 'sending' || msg.status === 'sent')
        );
        
        if (existingMessageIndex !== -1) {
          console.log('Updating status of existing message:', prevMessages[existingMessageIndex].id);
          // Update the existing message with the server-generated ID and delivered status
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = {
            ...updatedMessages[existingMessageIndex],
            id: processedMessage.id, // Use the server-generated ID
            status: 'delivered'
          };
          return updatedMessages;
        }
      }
      
      // If we didn't find a match or this is an incoming message, check for exact duplicates
      const isDuplicate = prevMessages.some(msg => msg.id === processedMessage.id);
      if (isDuplicate) {
        console.log('Duplicate message detected, not adding to state');
        return prevMessages;
      }
      
      // Add the new message and sort by timestamp
      console.log('Adding new message to state:', processedMessage.id);
      const newMessages = [...prevMessages, processedMessage].sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      return newMessages;
    });
    
    // Update contact's last message info if this is an incoming message
    if (isCurrentUserReceiver) {
      setContacts(prevContacts => {
        return prevContacts.map(contact => {
          if (String(contact.id) === String(processedMessage.senderId)) {
            // Increment unread count if this contact is not selected
            const shouldIncrementUnread = !selectedContact || String(selectedContact.id) !== String(processedMessage.senderId);
            
            return {
              ...contact,
              lastMessage: processedMessage.content,
              lastMessageTime: new Date(processedMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              unreadCount: shouldIncrementUnread ? (contact.unreadCount || 0) + 1 : 0
            };
          }
          return contact;
        });
      });
    }
    
    // Scroll to bottom on new message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [currentUserId, selectedContact]);

  // Fetch messages when a contact is selected
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  useEffect(() => {
    if (!selectedContact || !currentUserId) return;
    setIsLoadingMessages(true);
    setMessages([]); // Clear messages immediately so skeletons show every time
    const fetchMessages = async () => {
      try {
        // Reset unread count for this contact
        setContacts(prev => prev.map(contact => {
          if (contact.id === selectedContact.id) {
            return { ...contact, unreadCount: 0 };
          }
          return contact;
        }));
        
        // Fetch messages from the API
        const response = await fetch(
          `${API_BASE_URL}/messaging/messages/${currentUserId}?otherUserId=${selectedContact.id}&t=${Date.now()}`, 
          { headers: getAuthHeaders() }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          // Process and store messages
          const processedMessages = data.data.map((msg: any) => ({
            ...msg,
            id: msg.id || `api-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            senderId: String(msg.senderId),
            receiverId: String(msg.receiverId),
            timestamp: msg.timestamp || new Date().toISOString(),
            type: msg.type || 'text',
            status: 'delivered'
          }));
          
          setMessages(processedMessages);
          
          // Scroll to bottom after loading messages
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [currentUserId, selectedContact, getAuthHeaders]);

  // Filter messages for the selected contact
  const filteredMessages = messages.filter(message => {
    if (!selectedContact || !currentUserId) return false;
    
    const senderIdStr = String(message.senderId);
    const receiverIdStr = String(message.receiverId);
    const selectedContactIdStr = String(selectedContact.id);
    const currentUserIdStr = String(currentUserId);
    
    return (
      (senderIdStr === currentUserIdStr && receiverIdStr === selectedContactIdStr) ||
      (senderIdStr === selectedContactIdStr && receiverIdStr === currentUserIdStr)
    );
  });

  // Filter contacts based on search query and exclude followers if we're not in followers list mode
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (!showFollowersList ? !contact.isFollower || contact.lastMessage : true)
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length]);

  // Send message function
  const sendMessage = async () => {
    // Validate inputs
    if (!newMessage.trim() || !selectedContact || !currentUserId || !ws || ws.readyState !== WebSocket.OPEN) {
      if (!wsConnected || !ws || ws.readyState !== WebSocket.OPEN) {
        alert('Connection to chat server lost. Refreshing to reconnect...');
        window.location.reload();
      }
      return;
    }
    
    // Prevent double-sending
    if (isMessageSending) return;
    setIsMessageSending(true);
    
    try {
      // Generate a unique ID and timestamp
      const messageId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      // Create local message
      const message: Message = {
        id: messageId,
        senderId: currentUserId,
        receiverId: String(selectedContact.id),
        content: newMessage,
        timestamp,
        type: 'text',
        status: 'sending'
      };
      
      // Add message to local state immediately
      setMessages(prev => [...prev, message]);
      
      // Update contact's last message
      setContacts(prev => prev.map(contact => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
        }
        return contact;
      }));
      
      // Clear input
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      // Send via WebSocket
      const wsMessage = {
        action: 'sendMessage',
        message: {
          id: messageId,
          senderId: currentUserId,
          receiverId: String(selectedContact.id),
          content: newMessage,
          type: 'text',
          timestamp
        }
      };
      
      ws.send(JSON.stringify(wsMessage));
      
      // Update message status after sending
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, status: 'sent' } : m
        ));
      }, 500);
      
      // Fetch updated messages from server after a delay
      // This ensures we have server-generated IDs for our local messages
      setTimeout(async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/messaging/messages/${currentUserId}?otherUserId=${selectedContact.id}&t=${Date.now()}`, 
            { headers: getAuthHeaders() }
          );
          
          const data = await response.json();
          
          if (data.status === 'success' && Array.isArray(data.data)) {
            // Process messages from server
            const serverMessages = data.data.map((msg: any) => ({
              ...msg,
              id: msg.id,
              senderId: String(msg.senderId),
              receiverId: String(msg.receiverId),
              timestamp: msg.timestamp || new Date().toISOString(),
              type: msg.type || 'text',
              status: 'delivered'
            }));
            
            // Merge with any pending local messages
            setMessages(prev => {
              // Find messages that are only in the local state
              const localOnlyMessages = prev.filter(localMsg => 
                !serverMessages.some((serverMsg : Message) => {
                  // Match by content, sender, receiver and approximate timestamp
                  return serverMsg.content === localMsg.content && 
                         serverMsg.senderId === localMsg.senderId && 
                         serverMsg.receiverId === localMsg.receiverId &&
                         Math.abs(new Date(serverMsg.timestamp).getTime() - new Date(localMsg.timestamp).getTime()) < 5000;
                })
              );
              
              // Combine and sort
              return [...serverMessages, ...localOnlyMessages].sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });
          }
        } catch (error) {
          console.error('Error refreshing messages after send:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark message as error
      setMessages(prev => prev.map(m => 
        m.content === newMessage && m.status === 'sending' 
          ? { ...m, status: 'error' } 
          : m
      ));
    } finally {
      setIsMessageSending(false);
    }
  };

  // UI helpers
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  
  // Header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        if (window.scrollY > lastScrollY) {
          setVisible(false); // Hide on scroll down
        } else {
          setVisible(true); // Show on scroll up
        }
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex bg-mainbg flex-col min-h-screen mx-auto">
      <div
        className={`bg-white border-b sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        } md:translate-y-0`}
      >
        <Header />
      </div>

      <div className="flex flex-row w-full h-[calc(100vh-4rem)] max-w-7xl mx-auto">
        {/* Left Sidebar - Contacts */}
        <div className="w-1/4 bg-white border-r h-full flex flex-col relative">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {isLoadingContacts ? (
            <div className="p-4">
              {/* Skeleton for contacts list */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-3">
                  <Skeleton circle height={48} width={48} />
                  <div className="flex-1">
                    <Skeleton height={16} width="60%" style={{ marginBottom: 8 }} />
                    <Skeleton height={12} width="40%" />
                  </div>
                </div>
              ))}
            </div>
          ) : contactsError ? (
            <div className="p-4 text-center">
              <p className="text-red-500">{contactsError}</p>
              <button 
                className="mt-2 text-blue-500 hover:underline"
                onClick={() => {
                  setIsLoadingContacts(true);
                  fetch(`${API_BASE_URL}/messaging/contacts/${currentUserId}`, {
                    headers: getAuthHeaders()
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.status === 'success') {
                        const formattedContacts = data.data.map((contact: any) => ({
                          id: contact.id,
                          name: contact.name,
                          profilePicture: contact.profilePicture,
                          organisation: contact.organisation,
                          department: contact.department,
                          online: contact.online,
                          lastSeen: contact.lastSeen,
                          isFollower: contact.isFollower || false,
                          lastMessage: '',
                          lastMessageTime: '',
                          unreadCount: 0
                        }));
                        
                        setContacts(formattedContacts);
                        setContactsError(null);
                      } else {
                        setContactsError('Failed to fetch contacts');
                      }
                    })
                    .catch(err => {
                      console.error('Error fetching contacts:', err);
                      setContactsError('Error connecting to server');
                    })
                    .finally(() => {
                      setIsLoadingContacts(false);
                    });
                }}
              >
                Retry
              </button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Follow to Connect and Grow</p>
              <button onClick={() => navigate(`/network/${currentUserId}`)} className="mt-2 text-blue-500 hover:underline">Start Following</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedContact?.id === contact.id ? "bg-blue-50" : ""}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={contact.profilePicture || profile}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                        )}
                      </div>
                      {contact.lastMessage ? (
                        <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                      ) : contact.isFollower ? (
                        <p className="text-xs text-blue-500">Follower • Start a conversation</p>
                      ) : (
                        <p className="text-xs text-gray-400">No messages yet</p>
                      )}
                    </div>
                    {contact.unreadCount ? (
                      <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Floating action button for new chat */}
          <button
            className="absolute bottom-6 right-6 p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
            onClick={() => {
              // Toggle followers list display
              setShowFollowersList(prev => !prev);
              // Reset search query when showing followers
              setSearchQuery('');
            }}
            title="Start New Chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          
          {/* Followers list overlay for new chats */}
          {showFollowersList && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                <h3 className="font-medium">Start a new conversation</h3>
                <button 
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setShowFollowersList(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search followers"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                {contacts
                  .filter(contact => contact.isFollower)
                  .filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(contact => (
                    <div 
                      key={contact.id} 
                      className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowFollowersList(false);
                      }}
                    >
                      <div className="relative">
                        <img
                          src={contact.profilePicture || profile}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-blue-500">Start a conversation</p>
                      </div>
                    </div>
                  ))}
                {contacts.filter(contact => contact.isFollower).length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p>You don't have any followers to chat with.</p>
                    <button onClick={() => navigate(`/network/${currentUserId}`)} className="mt-2 text-blue-500 hover:underline">Start Following</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div onClick={() => {navigate(`/connect/profile/${selectedContact.id}`)}} className="flex items-center cursor-pointer">
                  <img
                    src={selectedContact.profilePicture || profile}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h2 className="font-semibold">{selectedContact.name}</h2>
                    {selectedContact.online && (
                      <span className="text-sm text-green-500">Online</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone
                    className="text-gray-600 cursor-pointer hover:text-gray-800"
                    size={20}
                  />
                  <Video
                    className="text-gray-600 cursor-pointer hover:text-gray-800"
                    size={20}
                  />
                  <MoreVertical
                    className="text-gray-600 cursor-pointer hover:text-gray-800"
                    size={20}
                  />
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {/* Skeleton for messages area while loading messages for selected contact */}
                {isLoadingMessages && !messages.length && (
                  <div>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex mb-2 items-end ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        {i % 2 !== 0 && (
                          <Skeleton circle width={32} height={32} style={{ marginRight: 8 }} />
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2`}
                          style={{
                            background: '#f3f4f6',
                            minWidth: 60,
                            maxWidth: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Skeleton height={12} width={80 + Math.random() * 40} style={{ marginBottom: 6, borderRadius: 8 }} />
                          <Skeleton height={10} width={40 + Math.random() * 30} style={{ borderRadius: 8 }} />
                        </div>
                        {i % 2 === 0 && (
                          <Skeleton circle width={32} height={32} style={{ marginLeft: 8 }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => {
                    const isSentByCurrentUser = String(message.senderId) === String(currentUserId);
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          isSentByCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSentByCurrentUser
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-75">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isSentByCurrentUser && message.status && (
                              <span className="text-xs ml-2">
                                {message.status === 'sending' && '⌛'}
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                                {message.status === 'error' && '⚠️'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg
                      className="w-16 h-16 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm">Start a conversation with {selectedContact.name}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t mt-auto">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none relative disabled:opacity-50"
                    disabled={!newMessage.trim() || isMessageSending || !wsConnected}
                  >
                    <Send size={20} />
                    {!wsConnected && (
                      <span 
                        className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full" 
                        title="Connection issue"
                      ></span>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">
                Select a contact to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesMainV2;
