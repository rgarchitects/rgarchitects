import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Table } from 'reactstrap';

const initialForm = { id: 0, firstName: '', lastName: '', email: '', isManager: false };

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const resp = await fetch('/api/users');
    const data = await resp.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  const onAdd = () => { setForm(initialForm); setModalOpen(true); };
  const onEdit = (u) => { setForm({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, isManager: u.isManager }); setModalOpen(true); };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    await loadUsers();
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = form.id && form.id !== 0 ? 'PUT' : 'POST';
    const url = method === 'POST' ? '/api/users' : `/api/users/${form.id}`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: form.id, firstName: form.firstName, lastName: form.lastName, email: form.email, isManager: form.isManager }) });
    setSaving(false);
    setModalOpen(false);
    await loadUsers();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Users</h2>
        <Button color="primary" onClick={onAdd}>Add User</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.isManager ? 'Yes' : 'No'}</td>
                <td>
                  <Button size="sm" color="secondary" className="me-2" onClick={() => onEdit(u)}>Edit</Button>
                  <Button size="sm" color="danger" onClick={() => onDelete(u.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={toggleModal}>{form.id ? 'Edit User' : 'Add User'}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={form.firstName} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={form.lastName} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input id="email" type="email" name="email" value={form.email} onChange={onChange} required />
            </FormGroup>
            <FormGroup check>
              <Input id="isManager" type="checkbox" name="isManager" checked={form.isManager} onChange={onChange} />
              <Label for="isManager" check>Is Manager</Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal} disabled={saving}>Cancel</Button>
            <Button color="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}


