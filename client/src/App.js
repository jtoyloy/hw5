import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { useTable } from "react-table";
import axios from "axios";

import "./App.css";

function App() {
  const [link, setLink] = useState([]);
  const [newLink, setNewLink] = useState({
    id: "",
    name: "",
    url: "",
  });
  const [updateLink, setUpdateLink] = useState({
    updateId: newLink.updateId,
    updateName: newLink.name,
    updateURL: newLink.url,
  });
  const [showModal, setShowModal] = useState(false);
  const [actualUpdatingId, setActualUpdatingId] = useState();
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "URL",
        accessor: "url",
      },
      {
        Header: "Edit",
        accessor: "edit",
        Cell: (row) => (
          <div style={{ textAlign: "center" }}>
            <Button
              variant="info"
              style={{ color: "white", width: "80px" }}
              size="md"
              onClick={() => handleOpenModal(row.cell.row.original.id)}
            >
              Edit
            </Button>
          </div>
        ),
      },
      {
        Header: "Delete",
        accessor: "delete",
        Cell: (row) => (
          <div style={{ textAlign: "center" }}>
            <Button
              variant="danger"
              style={{ width: "80px" }}
              size="md"
              onClick={() => handleDelete(row.cell.row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );
  const data = [...link];
  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  useEffect(() => {
    console.log("useEffect called");
    const getLink = async () => {
      const res = await axios.get(
        `http://localhost:8000/links`
      );
      setLink(res.data);
    };
    getLink();
  }, []);

  const handleChange = (e) => {
    setNewLink({
      ...newLink,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeOnUpdating = (e) => {
    setUpdateLink({
      ...updateLink,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newLink);
    await axios.post(
      `http://localhost:8000/links`,
      newLink
    );
    alert("A new link has been created");
    const res = await axios.get(
      `http://localhost:8000/links`
    );
    setLink(res.data);

  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(newLink);
    await axios.put(
      `http://localhost:8000/links/` +
      actualUpdatingId,
      {
        id: updateLink.updateId,
        name: updateLink.updateName,
        url: updateLink.updateURL,
      }
    );
    alert("A new links has been updated");
    const res = await axios.get(
      `http://localhost:8000/links`
    );
    setLink(res.data);
    handleCloseModal();
  };

  const handleOpenModal = (id) => {
    setShowModal(true);
    setActualUpdatingId(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    console.log(id);
    await axios.delete(
      `http://localhost:8000/links/` +
      id
    );
    alert("A links has been deleted");
    const res = await axios.get(
      `http://localhost:8000/links`
    );
    setLink(res.data);
  };

  return (
    <Container fluid="sm" className="p-3">
      <h1>Let's create a link</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Links Name</Form.Label>
          <Form.Control
            name="name"
            value={newLink.name}
            type="text"
            required
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Links URL</Form.Label>
          <Form.Control
            name="url"
            value={newLink.url}
            type="text"
            required
            onChange={handleChange}
          />
        </Form.Group>
        <br />
        <div style={{ width: "100%", textAlign: "center", marginBottom: "30px" }}><Button type="submit">Create a new link!</Button>
        </div>

      </Form>

      <h1>The list of links</h1>
      <Table responsive="lg" striped bordered hover {...getTableProps()}>
        <thead style={{textAlign:"center"}}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{textAlign:"center"}}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Let's update the link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Link Name</Form.Label>
              <Form.Control
                name="updateName"
                value={updateLink.updateName}
                type="text"
                required
                onChange={handleChangeOnUpdating}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Link URL</Form.Label>
              <Form.Control
                name="updateURL"
                value={updateLink.updateURL}
                type="text"
                required
                onChange={handleChangeOnUpdating}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button type="submit" onClick={handleUpdate} variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;