import React, { useEffect, useState } from "react";
import { IonIcon, IonSkeletonText, IonText } from "@ionic/react";
import { arrowDown, arrowUp } from "ionicons/icons";

import { getVotes, vote } from "../http/guides";
import Centered from "./Centered";

import "./Votes.css";
import { useAppContext } from "../lib/context-lib";

const Votes: React.FC<{
  post: string,
}> = ({ post }) => {
  const [votes, setVotes] = useState<number | null>(null);
  const [userVote, setUserVote] = useState<{
    isUpvote: boolean,
  } | null>(null);
  const { currentUser } = useAppContext() as any;

  const onUpvote = async () => {
    if (userVote && userVote.isUpvote) {
      setUserVote(null);
      setVotes(votes as number - 1);
    } else {
      setUserVote({
        ...userVote,
        isUpvote: true
      });
      setVotes(votes as number + 1);
    }

    try {
      await vote(post, currentUser.token, {
        isUpvote: true
      });

    } catch (error) {
      console.log(error);
    }
  };

  const onDownvote = async () => {
    if (userVote && !userVote.isUpvote) {
      setUserVote(null);
      setVotes(votes as number + 1);
    } else {
      setUserVote({
        ...userVote,
        isUpvote: false
      });
      setVotes(votes as number - 1);
    }

    try {
      await vote(post, currentUser.token, {
        isUpvote: false
      });

    } catch (error) {
      console.log(error);
    }
  };

  const fetchVotes = async () => {
    try {
      const { data } = await getVotes(post, currentUser.token);
      setVotes(data.votes);
      data.userVote && setUserVote(data.userVote);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <div className="votes">
      {(votes === null) ? (
        <IonSkeletonText animated style={{ width: '15%' }} />
      ) : (
          <>
            <strong>
              <IonIcon
                icon={arrowUp}
                onClick={onUpvote}
                color={(userVote && userVote.isUpvote) ? "danger" : "dark"}
              />
            </strong>
            <small>
              <IonText
                color={userVote ? (userVote.isUpvote ? "danger" : "tertiary") : "dark"}
              >{votes}</IonText>
            </small>
            <strong>
              <IonIcon
                icon={arrowDown}
                onClick={onDownvote}
                color={(userVote && !userVote.isUpvote) ? "tertiary" : "dark"}
              />
            </strong>
          </>
        )}
    </div>
  );
};

export default Votes;