import { setObject, getObject } from "./storage";
import { STORAGE_KEY } from "../http/constants";

document.addEventListener("resume", onResume, false);

async function onResume(resumeEvent) {
  if (resumeEvent.pendingResult) {
    if (resumeEvent.pendingResult.pluginStatus === "OK") {
      var contact = navigator.contacts.create(resumeEvent.pendingResult.result);
      const { currentUser } = await getObject(STORAGE_KEY);
      await setObject(STORAGE_KEY, {
        currentUser: {
          ...currentUser,
          emergencyContact: {
            displayName: contact.displayName || contact.name,
            phone: contact.phoneNumbers[0].value,
          },
        },
      });
    } else {
      console.error(resumeEvent.pendingResult.result);
    }
  }
}

export default function useContacts() {
  return function () {
    return new Promise(function (resolve, reject) {
      window.navigator.contacts.pickContact(resolve, reject);
    });
  };
}
