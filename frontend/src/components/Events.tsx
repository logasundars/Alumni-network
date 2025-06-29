import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Container, 
  Row, 
  Col, 
  Alert, 
  Badge, 
  Modal, 
  Form, 
  Spinner,
  InputGroup,
  Dropdown,
  DropdownButton
} from 'react-bootstrap';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  virtualMeetingLink: string;
  eventType: string;
  status: string;
  imageUrl: string;
  maxAttendees: number;
  isRegistrationRequired: boolean;
  isVirtual: boolean;
  organizerName: string;
  organizerEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface EventsProps {
  user: User;
  onLogout: () => void;
}

const Events: React.FC<EventsProps> = ({ user, onLogout }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    virtualMeetingLink: '',
    eventType: 'NETWORKING',
    status: 'UPCOMING',
    imageUrl: '',
    maxAttendees: '',
    isRegistrationRequired: false,
    isVirtual: false
  });

  const eventTypes = [
    'NETWORKING', 'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'CAREER_FAIR',
    'SOCIAL_GATHERING', 'MENTORSHIP_SESSION', 'ALUMNI_REUNION', 'GUEST_LECTURE', 'HACKATHON', 'OTHER'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      setError('Network error while loading events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const eventData = {
      ...formData,
      maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null
    };

    try {
      const url = editingEvent 
        ? `/api/events/${editingEvent.id}?organizerEmail=${user.email}`
        : `/api/events?organizerEmail=${user.email}`;
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingEvent(null);
        resetForm();
        fetchEvents();
      } else {
        const errorData = await response.json();
        setError(errorData || 'Failed to save event');
      }
    } catch (err) {
      setError('Network error while saving event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}?organizerEmail=${user.email}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Event deleted successfully!');
        fetchEvents();
      } else {
        const errorData = await response.json();
        setError(errorData || 'Failed to delete event');
      }
    } catch (err) {
      setError('Network error while deleting event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startTime: event.startTime.slice(0, 16), // Format for datetime-local input
      endTime: event.endTime.slice(0, 16),
      location: event.location || '',
      virtualMeetingLink: event.virtualMeetingLink || '',
      eventType: event.eventType,
      status: event.status,
      imageUrl: event.imageUrl || '',
      maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : '',
      isRegistrationRequired: event.isRegistrationRequired,
      isVirtual: event.isVirtual
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      virtualMeetingLink: '',
      eventType: 'NETWORKING',
      status: 'UPCOMING',
      imageUrl: '',
      maxAttendees: '',
      isRegistrationRequired: false,
      isVirtual: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedEventType === 'ALL' || event.eventType === selectedEventType;
    return matchesSearch && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'primary';
      case 'ONGOING': return 'success';
      case 'COMPLETED': return 'secondary';
      case 'CANCELLED': return 'danger';
      case 'POSTPONED': return 'warning';
      default: return 'info';
    }
  };

  const getEventTypeBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'NETWORKING': return 'info';
      case 'WORKSHOP': return 'warning';
      case 'CONFERENCE': return 'primary';
      case 'CAREER_FAIR': return 'success';
      case 'MENTORSHIP_SESSION': return 'dark';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading events...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Events Management</h4>
              <div>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="me-2"
                >
                  Create Event
                </Button>
                <Button variant="outline-danger" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {/* Search and Filter */}
              <Row className="mb-3">
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <DropdownButton
                    title={`Event Type: ${selectedEventType}`}
                    variant="outline-secondary"
                  >
                    <Dropdown.Item onClick={() => setSelectedEventType('ALL')}>
                      All Types
                    </Dropdown.Item>
                    {eventTypes.map(type => (
                      <Dropdown.Item 
                        key={type} 
                        onClick={() => setSelectedEventType(type)}
                      >
                        {type}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </Row>

              {/* Events List */}
              {filteredEvents.length === 0 ? (
                <Alert variant="info">
                  {searchTerm || selectedEventType !== 'ALL' 
                    ? 'No events match your search criteria.' 
                    : 'No events found. Create the first event!'}
                </Alert>
              ) : (
                <Row>
                  {filteredEvents.map(event => (
                    <Col md={6} lg={4} key={event.id} className="mb-3">
                      <Card>
                        {event.imageUrl && (
                          <Card.Img 
                            variant="top" 
                            src={event.imageUrl} 
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{event.title}</Card.Title>
                          <Card.Text>
                            {event.description.length > 100 
                              ? `${event.description.substring(0, 100)}...` 
                              : event.description}
                          </Card.Text>
                          
                          <div className="mb-2">
                            <Badge bg={getEventTypeBadgeVariant(event.eventType)} className="me-1">
                              {event.eventType}
                            </Badge>
                            <Badge bg={getStatusBadgeVariant(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                          
                          <div className="small text-muted mb-2">
                            <div><strong>Date:</strong> {new Date(event.startTime).toLocaleDateString()}</div>
                            <div><strong>Time:</strong> {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}</div>
                            {event.location && <div><strong>Location:</strong> {event.location}</div>}
                            {event.isVirtual && <div><strong>Virtual Event</strong></div>}
                            <div><strong>Organizer:</strong> {event.organizerName}</div>
                          </div>
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleEdit(event)}
                            >
                              Edit
                            </Button>
                            {event.organizerEmail === user.email && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(event.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Event Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type *</Form.Label>
                  <Form.Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Physical location"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Virtual Meeting Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="virtualMeetingLink"
                    value={formData.virtualMeetingLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    placeholder="Leave empty for unlimited"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                  label="Virtual Event"
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  name="isRegistrationRequired"
                  checked={formData.isRegistrationRequired}
                  onChange={handleChange}
                  label="Registration Required"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Event'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type *</Form.Label>
                  <Form.Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Physical location"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Virtual Meeting Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="virtualMeetingLink"
                    value={formData.virtualMeetingLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    placeholder="Leave empty for unlimited"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                  label="Virtual Event"
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  name="isRegistrationRequired"
                  checked={formData.isRegistrationRequired}
                  onChange={handleChange}
                  label="Registration Required"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Events; 