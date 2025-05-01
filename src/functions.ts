// Utility function to capitalize the first letter
export function capitalizeFirstLetter(string: string | null | undefined): string {
    if (!string) return ''; // Return empty string if input is null or undefined
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  export function truncateString(str : string, maxLength : number) {
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    }
  
  export function getRandomNumber() {
    return Math.floor(Math.random() * 6) + 2;
  }
  
  
  export function getCategoryId(category: string): number {
    switch (category) {
      case "organisation": return 1;
      case "doctor": return 2;
      case "student": return 3;
      default: return 2;
    }
  }
    

  
// Helper function to format timestamps
 export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return `${diffSecs}s`
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`

  return date.toLocaleDateString()
}