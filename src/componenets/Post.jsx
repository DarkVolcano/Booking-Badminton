import React, { useState, useEffect, Fragment, useContext } from "react";
import "../css/StyleDashboardAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserContext } from "../UserContext";

const Post = () => {
  useEffect(() => {
    let sidebar, sidebarBtn;
    if (user.roleId === 1) {
      sidebar = document.querySelector(".sidebarA");
    } else if (user.roleId === 3) {
      sidebar = document.querySelector(".sidebarM");
    }
    sidebarBtn = document.querySelector(".sidebarBtn");
    sidebarBtn.onclick = function () {
      sidebar.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };
  }, []);

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useContext(UserContext);

  const [account, setAccount] = useState("");
  const [context, setContext] = useState("");
  const [totalRate, setTotalRate] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");

  const [editPostId, setEditPostId] = useState("");
  const [editContext, setEditContext] = useState("");
  const [editTotalRate, setEditTotalRate] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    getData();
    document.title = "Post Management";
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://localhost:7088/api/Posts");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (id) => {
    setDeletePostId(id);
    setShowDeleteModal(true);
  };
  const handleCreateClose = () => setShowCreateModal(false);
  const handleCreateShow = () => setShowCreateModal(true);

  const handleDelete = () => {
    axios
      .delete(`https://localhost:7088/api/Posts/${deletePostId}`)
      .then((result) => {
        handleDeleteClose();
        getData();
        toast.success("Post has been delete");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7088/api/Posts/${id}`)
      .then((result) => {
        setEditContext(result.data.context);
        setEditTotalRate(result.data.totalRate);
        setEditImage(result.data.image);
        setEditTitle(result.data.title.trim());
        setEditPostId(result.data.postId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = async () => {
    const url = `https://localhost:7088/api/Posts/${editPostId}`;
    const data = {
      postId: editPostId,
      context: editContext,
      totalRate: editTotalRate,
      image: editImage,
      title: editTitle,
    };

    try {
      if (editImageFile) {
        await handleUploadImage(editPostId);
      }

      const response = await axios.put(url, data);
      handleClose();
      getData();
      clear();
      toast.success("Post has been updated");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Error updating post");
    }
  };

  const handleUploadImage = async (postId) => {
    const formData = new FormData();
    formData.append("image", editImageFile);

    try {
      const response = await axios.post(
        `https://localhost:7088/api/Posts/UploadPostImage/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image has been uploaded");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Error uploading image");
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSave = () => {
    const url = "https://localhost:7088/api/Posts";
    const data = {
      accountId: user.accountId,
      context: context,
      totalRate: totalRate,
      image: image,
      title: title,
    };

    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        handleCreateClose();
        toast.success("Post has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setContext("");
    setTotalRate(0);
    setImage("");
    setTitle("");
    setEditContext("");
    setEditTotalRate("");
    setEditImage("");
    setEditTitle("");
    setEditPostId("");
  };

  const columns = [
    { field: "postId", headerName: "PostID" },
    { field: "accountId", headerName: "Account" },
    { field: "context", headerName: "Context" },
    { field: "totalRate", headerName: "Total Rate" },
    { field: "image", headerName: "Image" },
    { field: "title", headerName: "Title" },
    {
      field: "Action",
      type: "Actions",
      headerName: "Actions",
      cellClassName: "actions",
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="inherit"
            onClick={() => handleEdit(params.row.postId)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
            onClick={() => handleDeleteShow(params.row.postId)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Fragment>
        <ToastContainer />
        <section
          className={user.roleId === 1 ? "home-section" : "home-section-M"}
          style={{ padding: "0 27px" }}
        >
          <nav>
            <div className="sidebar-button">
              <i className="bx bx-menu sidebarBtn"></i>
              <span className="dashboard">Post</span>
            </div>
          </nav>
          <div
            className={user.roleId === 1 ? "home-content" : "home-content-M"}
          >
            <div className="infor">
              <div className="total">{data.length} total</div>
              <div className="function">
                <Button
                  className="btn btn-primary create"
                  onClick={handleCreateShow}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(data) => data.postId}
              columns={columns}
              rows={data}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 7,
                  },
                },
              }}
              pageSizeOptions={[7]}
              sx={{
                width: "-webkit-fill-available",
              }}
            />
          </div>

          <Modal
            show={showCreateModal}
            onHide={handleCreateClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Create Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter account"
                    value={user.accountId}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter rating"
                    value={totalRate}
                    onChange={(e) => setTotalRate(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="file"
                    className="form-control mb-3"
                    placeholder="Enter image"
                    onChange={handleImageChange}
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      style={{ width: "100%", marginTop: "10px" }}
                    />
                  )}
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCreateClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Modify / Update Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter context"
                    value={editContext}
                    onChange={(e) => setEditContext(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter total rate"
                    value={editTotalRate}
                    onChange={(e) => setEditTotalRate(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter image"
                    onChange={handleEditImageChange}
                  />
                  <img
                    src={editImage}
                    alt="Post"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this role?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      </Fragment>
    </>
  );
};

export default Post;
