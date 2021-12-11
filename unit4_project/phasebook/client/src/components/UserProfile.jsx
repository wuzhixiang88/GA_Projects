import React, { useRef } from "react";
// EXTERNAL PLUGIN IMPORTS
import axios from "axios";
// LOGO/IMAGE IMPORTS
import emptyImage from "../empty.png";
// BOOTSTRAP COMPONENT IMPORTS
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const UserProfile = ({ userProfile, userPhotos, setUserPhotos }) => {
  const coverPhotoInput = useRef();
  const profilePhotoInput = useRef();

  const handleClickEditCoverPhoto = () => {
    coverPhotoInput.current.click();
  };
  const handleClickEditProfile = () => {
    profilePhotoInput.current.click();
  };

  const handleUserPhotos = async (e) => {
    const key = e.target.getAttribute("data-name");
    const value = e.target.files[0];

    setUserPhotos({
      ...userPhotos,
      [key]: value,
    });

    if (!userPhotos.coverPhoto && !userPhotos.profilePhoto) {
      try {
        const uploadData = new FormData();
        uploadData.append(
          key === "coverPhoto"
            ? "cover_photo"
            : key === "profilePhoto"
            ? "profile_photo"
            : null,
          e.target.files[0],
          e.target.files[0].name
        );
        uploadData.append("user", userProfile.username);

        const response = await axios.post("/accounts/api/profile", uploadData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (response.status === 201) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    } else {
      try {
        const uploadData = new FormData();
        uploadData.append(
          key === "coverPhoto"
            ? "user_profile.cover_photo"
            : key === "profilePhoto"
            ? "user_profile.profile_photo"
            : null,
          e.target.files[0],
          e.target.files[0].name
        );
        uploadData.append("user", userProfile.username);

        const response = await axios.patch(
          `/accounts/api/profile/edit/${localStorage.getItem("id")}`,
          uploadData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };

  return (
    <Container fluid>
      {/* COVER PHOTO SECTION */}
      <Row className="justify-content-md-center">
        <Col md={5} className="px-0">
          <Card>
            <Card.Img
              src={
                userProfile.user_profile &&
                typeof userProfile.user_profile.cover_photo === "string"
                  ? userProfile.user_profile.cover_photo
                  : emptyImage
              }
              alt=""
              style={{
                height: "400px",
                objectFit: "cover",
              }}
            />
            <Card.ImgOverlay>
              <Form>
                <Form.Control
                  ref={coverPhotoInput}
                  type="file"
                  accept="image/*"
                  id="user-cover-photo-input"
                  data-name="coverPhoto"
                  onChange={handleUserPhotos}
                />
                <Button
                  className="position-absolute bottom-0 end-0 me-3 mb-3"
                  onClick={handleClickEditCoverPhoto}
                >
                  Edit Cover Photo
                </Button>
              </Form>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>

      {/* PROFILE PHOTO SECTION */}
      <Row className="justify-content-md-center mt-3">
        <Col md={5} className="px-0">
          <Card className="d-flex flex-row border-0">
            <Col md="auto">
              <Card.Img
                src={
                  userProfile.user_profile &&
                  typeof userProfile.user_profile.profile_photo === "string"
                    ? userProfile.user_profile.profile_photo
                    : emptyImage
                }
                alt=""
                className="border rounded-circle"
                style={{
                  height: "150px",
                  width: "150px",
                  objectFit: "cover",
                }}
              />
            </Col>
            <Col md="auto" className="d-flex flex-column align-self-center">
              <Col md={12} className="fs-2 fw-bold ms-3">
                {`${userProfile.first_name} ${userProfile.last_name}`}
              </Col>
              <Col md={12} className="text-start fs-6 ms-3 ps-2">
                {userProfile.friend_list
                  ? userProfile.friend_list.friends.length === 1
                    ? `${userProfile.friend_list.friends.length} Friend`
                    : `${userProfile.friend_list.friends.length} Friends`
                  : "0 Friends"}
              </Col>
            </Col>
            <Col md="auto">
              <Form>
                <Form.Control
                  ref={profilePhotoInput}
                  type="file"
                  accept="image/*"
                  id="user-profile-photo-input"
                  data-name="profilePhoto"
                  onChange={handleUserPhotos}
                />
                <Button
                  variant="secondary"
                  className="position-absolute bottom-0 end-0"
                  onClick={handleClickEditProfile}
                >
                  Edit Profile
                </Button>
              </Form>
            </Col>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-3">
        <Col md={5} className="d-flex justify-content-start border-top px-0">
          <Button variant="outline-primary" className="fw-bold border-0 mt-3">
            Posts
          </Button>
          <Button variant="outline-primary" className="fw-bold border-0 mt-3">
            About
          </Button>
          <Button variant="outline-primary" className="fw-bold border-0 mt-3">
            Friends
          </Button>
          <Button variant="outline-primary" className="fw-bold border-0 mt-3">
            Photos
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
