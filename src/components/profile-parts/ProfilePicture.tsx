import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IonButton, IonCol, IonIcon, IonRow, IonSpinner } from "@ionic/react";
import { checkmark, checkmarkCircle, close, pencil } from "ionicons/icons";

import { ProfileData } from "../Profile";
import Centered from "../Centered";
import { MAX_ATTACHMENT_SIZE, PROFILE_PICTURE_FORMATS } from "../../http/constants";
import { editUser } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useMounted from "../../lib/mount-lib";
import useToastManager from "../../lib/toast-manager";
import userPicture from "../../http/helpers/user-picture";
import LazyImage from "../LazyImage";

const profilePictureSchema = Yup.object({
  picture: Yup.mixed()
    .test("fileType", "Unsupported format.", (value) =>
      value ? PROFILE_PICTURE_FORMATS.includes(value.type) : true
    )
    .test("fileSize", "That's too big", (value) =>
      value ? value.size <= MAX_ATTACHMENT_SIZE : true
    )
});

const ProfilePicture: React.FC<{
  user: ProfileData
}> = ({ user }) => {
  const [preview, setPreview] = useState(userPicture(user));
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();
  const { onError, onSuccess } = useToastManager();

  const onSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const { data } = await editUser(user._id, currentUser.token, values, true);
      isMounted && resetForm({});
      setCurrentUser({
        picture: data.picture,
      });
      onSuccess("Profile picture updated");
    } catch (error) {
      onError(error.message);
    } finally {
      isMounted && setSubmitting(false);
    }
  };

  useEffect(() => () => setMounted(false), []);

  const isCurrent = user._id === currentUser._id;

  return (
    <Centered>
      <div className="border-circle profile-picture">
        {isCurrent && (
          <div className="profile-picture__edit">
            <Formik
              validationSchema={profilePictureSchema}
              onSubmit={onSubmit}
              initialValues={{
                picture: undefined,
              }}
            >
              {({
                setFieldValue,
                setFieldError,
                values,
                isValid,
                errors,
                isSubmitting,
              }) => {
                const canShowSubmit = (values.picture && isValid);
                const fieldName = "picture";
                const resetField = () => {
                  setFieldValue(fieldName, undefined);
                  setFieldError(fieldName, null as any);
                };

                return (
                  <Form noValidate className="h100">
                    <div className={"profile-picture__field-container h100 " + (canShowSubmit ? "h0" : "")}>
                      <Field
                        name={fieldName}
                        component={CustomPictureUpload}
                        setFieldValue={setFieldValue}
                        setPhotoPreview={setPreview}
                      />
                    </div>
                    {errors.picture && (
                      <div className="profile-picture__error">
                        {errors.picture}
                      </div>
                    )}

                    <div
                      className={"profile-picture__submit " + (canShowSubmit ? "" : "h0")}
                    >
                      <IonButton
                        expand="full"
                        color="danger"
                        onClick={resetField}
                        disabled={isSubmitting}
                      >
                        <IonIcon icon={close} className="button-icon" />
                      </IonButton>
                      <IonButton
                        expand="full"
                        color="success"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <IonSpinner name="lines-small" className="button-icon" />
                        ) : (
                            <IonIcon icon={checkmark} className="button-icon" />
                          )}
                      </IonButton>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
        <LazyImage src={(preview) as any} alt={user.fullName} className="profile-picture__avatar" />
      </div>
    </Centered>
  );
}

export default ProfilePicture;

interface UploadProps {
  field: any,
  setPhotoPreview: (arg: any) => any,
  setFieldValue: (name: string, value: any) => any,
};

function CustomPictureUpload({
  field,
  setPhotoPreview,
  setFieldValue,
}: UploadProps) {
  const fileUpload = useRef<HTMLInputElement | null>(null);

  const showFileUpload = () => {
    fileUpload.current!.click();
  };
  const handleImageChange = (e: any) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    reader.onload = () => {
      setPhotoPreview(reader.result);
    };

    reader.readAsDataURL(file);
    setFieldValue(field.name, file);
  };

  return (
    <>
      <input
        type="file"
        onChange={handleImageChange}
        ref={fileUpload}
        hidden
      />
      <IonButton onClick={showFileUpload} fill="clear" color="light" expand="full">
        <IonIcon icon={pencil} slot="icon-only" />
      </IonButton>
    </>
  );
}