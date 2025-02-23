import axios from "axios";
import { toast } from "sonner";

const id = localStorage.getItem("Id");
const intid = parseInt(id || "");

export async function handleaddaward(data: any, editingAward: any) {
  console.log(data, data.title, data.organization);
  console.log(editingAward);
  console.log(!!editingAward);

  if (!!editingAward) {
    const loading = toast.loading("updating award");
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-achievements-awards/${id}`,
        {
          userId: intid,
          awardid: editingAward.id,
          awardName: data.title,
          awardedBy: data.organization,
          awardDate: data.year,
          descreption: data.description,
          awardMediaLink: data.credentialLink,
        }
      );
      if (response) {
        toast.dismiss(loading);

        toast.success("updated successfully");
      }
    } catch (e: any) {
      toast.dismiss(loading);
      toast.error(e.message);
      console.log(e);
    }
  } else {
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-achievements-awards/${id}`,
        {
          userId: intid,
          awardName: data.title,
          awardedBy: data.organization,
          awardDate: data.year,
          descreption: data.description,
          awardMediaLink: data.credentialLink,
        }
      );
      console.log("added successfully");

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
}

export async function handleaddskills(data: any, editingInterest: any) {
  if (!!editingInterest) {
    const loading = toast.loading("Updating skills") 
    try {
       
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-skills/${id}`,
        {
          skillid: editingInterest.id,
          skill: data.skill,
        }
      );
      if(response){
        toast.dismiss(loading)
        toast.success("Updated successfully")
      }
    } catch (e) {
        toast.dismiss(loading)
        toast.error("Failed to update")
    }
  } else {
    const loading = toast.loading("Adding skill")
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-skills/${id}`,
        {
          skill: data.name,
          userId: intid,
        }
      );
      if(response){
        toast.dismiss(loading)
        toast.success("Added successfully")
      }
    } catch (e) {
        toast.dismiss(loading)
        toast.error("Failed to add skill")
    }
  }
}

export async function handleaddCertificate(
  data: any,
  editingCertification: any
) {
  if (!!editingCertification) {
    const loading = toast.loading("Updating licence and certifications")
    try {
      const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-certificate/${id}`, {
        certid: editingCertification.id,
        certificateName: data.certificateName,
        issuingOrganisation: data.issuingOrganisation,
        issueDate: data.issueDate,
        certificateURL: "",
        descreption: "",
        certificateMediaLink: "",
      });

      if(response){
        toast.dismiss(loading)
        toast.success("Updated successfully")
      }
    } catch (e) {
        toast.dismiss(loading)
        toast.error("Failed to edit, please try again")
      console.log(e);
    }
  } else {
    const loading = toast.loading("Adding the Licence and certification")
    try {
      const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-certificate/${id}`, {
        certificateName: data.certificateName,
        issuingOrganisation: data.issuingOrganisation,
        issueDate: data.issueDate,
        certificateURL: "",
        descreption: "",
        certificateMediaLink: "",
      });

      if(response){
        toast.dismiss(loading)
        toast.success("added Successfully")
      }

    } catch (e) {
        toast.dismiss(loading)
        toast.error("Failed to add, please try again")
    }
  }
}

export async function handleaddMemberships(data: any, editingMembership: any) {
  if (!!editingMembership) {
    const loading = toast.loading("Updating memberships");
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-memberships/${id}`,
        {
          embid: editingMembership.id,
          societyName: data.name,
          position: data.position,
          relatedDepartment: data.category,
          membershipId: data.membershipId,
        }
      );

      if (response) {
        toast.dismiss(loading);
        toast.success("updated successfully");
      }
    } catch (e) {
      toast.dismiss(loading);
      toast.error("failed to update");
    }
  } else {
    const loading = toast.loading("Adding Membership");
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-memberships/${id}`,
        {
          societyName: data.name,
          position: data.position,
          relatedDepartment: data.category,
          membershipId: data.membershipId,
        }
      );

      if (response) {
        toast.dismiss(loading);
        toast.success("Added successfully");
      }
    } catch (e) {
      toast.dismiss(loading);
      toast.error("failed to add membership");
    }
  }
}

export async function handleAddExperiences(data: any, editingExperience: any) {
  if (!!editingExperience) {
    const loading = toast.loading("Updating Experience")
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-professional-experience/${id}`,
        {
          expid: editingExperience.id,
          userId: intid,
          title: data.title,
          organisation: data.company,
          startDate: data.date,
          endDate: "",
          location: data.location,
        }
      );

      if(response){
        toast.dismiss(loading)
        toast.success("Updated Successfully")
      }
    } catch (e) {
      toast.dismiss(loading)
      toast.error("Failed to update, please try again")
    }
  } else {
    const loading = toast.loading("Adding Experience")
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-professional-experience/${id}`,
        {
          userId: intid,
          title: data.title,
          organisation: data.company,
          startDate: data.date,
          endDate: "",
          location: data.location,
        }
      );

      if(response){
        toast.dismiss(loading)
        toast.success("Added successfully")
      }
    } catch (e) {
      toast.dismiss(loading)
      toast.error("Failed to add, please try again")
    }
  }
}

export async function handleAddEducations(data: any, editingEducation: any) {
  if (!!editingEducation) {
    const loading = toast.loading("Updating education")
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-education/${id}`,
        {
          eduid: editingEducation.id,
          userId: intid,
          schoolName: data.schoolName,
          degree: data.degree,
          department: data.department,
          startDate: data.startDate,
          endDate: "",
          grade: data.grade,
        }
      );

      if(response){
        toast.dismiss(loading)
        toast.success("Updated successfully")
      }
    } catch (e) {
      toast.dismiss(loading)
      toast.error("Failed to update, please try again")
    }
  } else {
    const loading = toast.loading("Adding Education")
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/add-education/${id}`,
        {
          userId: intid,
          schoolName: data.schoolName,
          degree: data.degree,
          department: data.department,
          startDate: data.startDate,
          endDate: "",
          grade: data.grade,
        }
      );

      if(response){
        toast.dismiss(loading)
        toast.success("Successfully added")
      }
    } catch (e) {
      toast.dismiss(loading)
      toast.error("Failed to add, please try again")
    }
  }
}
