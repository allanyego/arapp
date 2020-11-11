import React, { useState } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonChip, useIonViewDidEnter, useIonViewWillLeave, IonIcon, IonCard } from "@ionic/react";
import { useParams } from "react-router";
import moment from "moment";
import { linkOutline } from "ionicons/icons";

import { getById } from "../http/guides";
import useToastManager from "../lib/toast-manager";
import LoaderFallback from "../components/LoaderFallback";
import ucFirst from "../lib/uc-first";
import Votes from "../components/Votes";
import useMounted from "../lib/mount-lib";
import { Plugins } from "@capacitor/core";
import { useAppContext } from "../lib/context-lib";

export default function Guide() {
  const { guideId } = useParams<any>();
  let [guide, setGuide] = useState<any>(null);
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();
  const { currentUser } = useAppContext() as any;

  const getGuideDetails = async () => {
    try {
      const { data } = await getById(guideId, currentUser.token);
      isMounted && setGuide(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(() => {
    getGuideDetails();
  });

  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle size="small">Guide Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!guide ? (
          <LoaderFallback />
        ) : (
            <div className="ion-padding-horizontal">
              <IonText>
                <h2>{ucFirst(guide.title)}</h2>
                <IonText color="medium">
                  <small>
                    <strong className="d-flex">
                      {moment(guide.createdAt, "YYYYMMDD").fromNow()}
                    </strong>
                  </small>
                </IonText>
                <div className="ion-margin-vertical">{guide.body}</div>
              </IonText>
              <Tags tags={guide.tags} />
              <Links links={guide.links} />
              <Votes post={guide._id} />
            </div>
          )}
      </IonContent>
    </IonPage>
  );
}

function Links({ links }: { links: any[] }) {
  return (
    <div className="ion-margin-vertical">
      {links.map((link: string, index: number) => {
        const [text, url] = link.split(",").map((li: any) => li.trim());
        const openUrl = () => Plugins.Browser.open({ url });

        return (
          <IonCard
            key={index}
            onClick={openUrl}
            className="ion-no-margin"
            button
            style={{
              padding: "0.35em .75em",
            }}
          >
            <IonText color="primary">
              <div className="d-flex ion-align-items-center ion-justify-content-between">
                <p className="ion-no-margin">{text}</p>
                <IonIcon icon={linkOutline} />
              </div>
            </IonText>
          </IonCard>
        );
      })}
    </div>
  );
}

function Tags({ tags }: { tags: any[] }) {
  return (
    <>
      {tags.map((tag: any, index: number) =>
        <IonChip key={index} color="tertiary">{tag}</IonChip>
      )}
    </>
  );
}