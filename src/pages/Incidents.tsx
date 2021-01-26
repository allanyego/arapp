import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonButtons,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";

import useToastManager from "../lib/toast-manager";
import { useAppContext } from "../lib/context-lib";
import useMounted from "../lib/mount-lib";
import LoaderFallback from "../components/LoaderFallback";
import { getUserIncidents } from "../http/incidents";
import IncidentItem from "../components/IncidentItem";
import IncidentModal from "../components/IncidentModal";
import "./Incidents.css";

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<any[] | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const { onError } = useToastManager();
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const closeModal = () => setSelectedIncident(null);
  const fetchIncidents = async () => {
    try {
      const { data } = await getUserIncidents(currentUser._id, currentUser.token);
      isMounted && setIncidents(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(fetchIncidents);
  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" />
          </IonButtons>
          <IonTitle size="small">Your incident history</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!incidents ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {incidents.map((incident: any) => (
                <IncidentItem
                  key={incident._id}
                  incident={incident}
                  onSelect={setSelectedIncident}
                />
              ))}
            </IonList>
          )}

        <IncidentModal
          isOpen={!!selectedIncident}
          onClose={closeModal}
          incident={selectedIncident}
        />
      </IonContent>
    </IonPage>
  );
};

export default Incidents;
