import React from "react";

const IncidentContact: React.FC<{
  incident: any,
}> = ({ incident }) => {
  const { location, contact } = incident;

  return (
    <>
      <p>
        Location: <strong>
          {location.name}
        </strong>
        <br />
        <small>
          Coordinates: <strong>(
                  {`${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                  )</strong>
        </small>
      </p>
      <p>
        Contact: <strong
          className="ion-text-capitalize"
        >{`${contact.displayName}, ${contact.phone}`}</strong>
      </p>
    </>
  );
};

export default IncidentContact;