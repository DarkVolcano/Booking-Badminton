import React, { useState, useEffect, Fragment } from "react";
import "../css/StyleDashboardManager.css";
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
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const AmenityCourt = () => {
  useEffect(() => {
    let sidebar = document.querySelector(".sidebarM");
    let sidebarBtn = document.querySelector(".sidebarBtn");
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
  const [deleteAmenityCourtId, setDeleteAmenityCourtId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [amenityId, setAmenityId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [status, setStatus] = useState(true);

  const [editAmenityCourtId, setEditAmenityCourtId] = useState("");
  const [editAmenityId, setEditAmenityId] = useState("");
  const [editCourtId, setEditCourtId] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  useEffect(() => {
    getData();
    document.title = "Amenity Court Manahement";
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get(
        "https://localhost:7088/api/AmenityCourts"
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (id) => {
    setDeleteAmenityCourtId(id);
    setShowDeleteModal(true);
  };
  const handleCreateClose = () => setShowCreateModal(false);
  const handleCreateShow = () => setShowCreateModal(true);

  const handleDelete = () => {
    axios
      .delete(
        `https://localhost:7088/api/AmenityCourts/${deleteAmenityCourtId}`
      )
      .then((result) => {
        handleDeleteClose();
        getData();
        toast.success("Amenity Court has been delete");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7088/api/AmenityCourts/${id}`)
      .then((result) => {
        setEditAmenityId(result.data.amenityId);
        setEditCourtId(result.data.courtId);
        setEditStatus(result.data.status);
        setEditAmenityCourtId(result.data.amenityCourtId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = (id) => {
    const url = `https://localhost:7088/api/AmenityCourts/${editAmenityId}`;
    const data = {
      amenityCourtId: editAmenityCourtId,
      amenityId: editAmenityId,
      courtId: editCourtId,
      status: editStatus,
    };

    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success("Amenity has been update");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7088/api/AmenityCourts";
    const data = {
      amenityId: amenityId,
      courtId: courtId,
      status: status,
    };

    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        handleCreateClose();
        toast.success("Amenity has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setAmenityId("");
    setCourtId("");
    setStatus(true);
    setEditAmenityId("");
    setEditCourtId("");
    setEditStatus(false);
    setEditAmenityCourtId("");
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditStatus(true);
    } else {
      setEditStatus(false);
    }
  };

  const columns = [
    { field: "amenityCourtId", headerName: "AmenityCourtID" },
    { field: "amenityId", headerName: "Amenity" },
    { field: "courtId", headerName: "Court" },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        const { status } = params.row;
        return status ? <TaskAltIcon /> : <HighlightOffIcon />;
      },
    },
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
            onClick={() => handleEdit(params.row.amenityCourtId)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
            onClick={() => handleDeleteShow(params.row.amenityCourtId)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Fragment>
        <ToastContainer />
        <section className="home-section-M" style={{ padding: "0 27px" }}>
          <nav>
            <div className="sidebar-button">
              <i className="bx bx-menu sidebarBtn"></i>
              <span className="dashboard">Amenity Court</span>
            </div>
          </nav>
          <div className="home-content-M">
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
              getRowId={(data) => data.amenityCourtId}
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
              <Modal.Title>Create Amenity Court</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter amenity"
                    value={amenityId}
                    onChange={(e) => setEditAmenityId(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter court"
                    value={courtId}
                    onChange={(e) => setEditCourtId(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={handleActiveChange}
                  />
                  <label>Status</label>
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
              <Modal.Title>Modify / Update Amenity Court</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter amenity"
                    value={editAmenityId}
                    onChange={(e) => setEditAmenityId(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter court"
                    value={editCourtId}
                    onChange={(e) => setEditCourtId(e.target.value)}
                  />
                </Col>
                <Col sm={12}>
                  <input
                    type="checkbox"
                    checked={editStatus}
                    onChange={(e) => handleEditActiveChange(e)}
                    value={editStatus}
                  />
                  <label>Status</label>
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
            <Modal.Body>
              Are you sure you want to delete this amenity court?
            </Modal.Body>
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

export default AmenityCourt;
