import React, { useState, useEffect, Fragment } from "react";
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
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Role = () => {
  useEffect(() => {
    let sidebar = document.querySelector(".sidebarA");
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
  const [deleteRoleId, setDeleteRoleId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState(true);

  const [editRoleID, setEditRoleID] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  useEffect(() => {
    getData();
    document.title = "Role Management";
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get("https://localhost:7088/api/Roles");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (id) => {
    setDeleteRoleId(id);
    setShowDeleteModal(true);
  };
  const handleCreateClose = () => setShowCreateModal(false);
  const handleCreateShow = () => setShowCreateModal(true);

  const handleDelete = () => {
    axios
      .delete(`https://localhost:7088/api/Roles/${deleteRoleId}`)
      .then((result) => {
        handleDeleteClose();
        getData();
        toast.success("Role has been delete");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7088/api/Roles/${id}`)
      .then((result) => {
        setEditRoleName(result.data.roleName);
        setEditStatus(result.data.status);
        setEditRoleID(result.data.roleId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = (id) => {
    const url = `https://localhost:7088/api/Roles/${editRoleID}`;
    const data = {
      roleId: editRoleID,
      roleName: editRoleName,
      status: editStatus,
    };

    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success("Role has been update");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7088/api/Roles";
    const data = {
      roleName: roleName,
      status: status,
    };

    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        handleCreateClose();
        toast.success("Role has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setRoleName("");
    setStatus(true);
    setEditRoleName("");
    setEditStatus(false);
    setEditRoleID("");
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
    { field: "roleId", headerName: "RoleID" },
    { field: "roleName", headerName: "Role Name" },
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
            onClick={() => handleEdit(params.row.roleId)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
            onClick={() => handleDeleteShow(params.row.roleId)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Fragment>
        <ToastContainer />
        <section className="home-section" style={{ padding: "0 27px" }}>
          <nav>
            <div className="sidebar-button">
              <i className="bx bx-menu sidebarBtn"></i>
              <span className="dashboard">Role</span>
            </div>
          </nav>
          <div className="home-content">
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
              getRowId={(data) => data.roleId}
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
              <Modal.Title>Create Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter role name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
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
              <Modal.Title>Modify / Update Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter role name"
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
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

export default Role;
