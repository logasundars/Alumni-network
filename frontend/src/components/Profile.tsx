import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, Badge } from 'react-bootstrap';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  profilePicture: string;
  currentCompany: string;
  currentPosition: string;
  graduationYear: string;
  major: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    currentCompany: '',
    currentPosition: '',
    graduationYear: '',
    major: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile?email=${user.email}`);
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          bio: profileData.bio || '',
          currentCompany: profileData.currentCompany || '',
          currentPosition: profileData.currentPosition || '',
          graduationYear: profileData.graduationYear || '',
          major: profileData.major || '',
          linkedinUrl: profileData.linkedinUrl || '',
          githubUrl: profileData.githubUrl || '',
          portfolioUrl: profileData.portfolioUrl || ''
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Network error while loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/profile?email=${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error while updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Profile Management</h4>
              <div>
                <Button 
                  variant="outline-primary" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="me-2"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button variant="outline-danger" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Company</Form.Label>
                        <Form.Control
                          type="text"
                          name="currentCompany"
                          value={formData.currentCompany}
                          onChange={handleChange}
                          placeholder="Your current company"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Position</Form.Label>
                        <Form.Control
                          type="text"
                          name="currentPosition"
                          value={formData.currentPosition}
                          onChange={handleChange}
                          placeholder="Your current position"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Graduation Year</Form.Label>
                        <Form.Control
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          placeholder="e.g., 2023"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Major</Form.Label>
                        <Form.Control
                          type="text"
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          placeholder="e.g., Computer Science"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>GitHub URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Portfolio URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={saving}
                    className="me-2"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Form>
              ) : (
                <div>
                  <Row>
                    <Col md={8}>
                      <h5>{profile?.firstName} {profile?.lastName}</h5>
                      <p className="text-muted">{profile?.email}</p>
                      <Badge bg="primary" className="mb-3">{profile?.role}</Badge>
                      
                      {profile?.bio && (
                        <div className="mb-3">
                          <h6>Bio</h6>
                          <p>{profile.bio}</p>
                        </div>
                      )}

                      <Row>
                        <Col md={6}>
                          <h6>Professional Information</h6>
                          {profile?.currentCompany && (
                            <p><strong>Company:</strong> {profile.currentCompany}</p>
                          )}
                          {profile?.currentPosition && (
                            <p><strong>Position:</strong> {profile.currentPosition}</p>
                          )}
                        </Col>
                        <Col md={6}>
                          <h6>Education</h6>
                          {profile?.graduationYear && (
                            <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
                          )}
                          {profile?.major && (
                            <p><strong>Major:</strong> {profile.major}</p>
                          )}
                        </Col>
                      </Row>

                      <h6>Social Links</h6>
                      <div className="mb-3">
                        {profile?.linkedinUrl && (
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm me-2">
                            LinkedIn
                          </a>
                        )}
                        {profile?.githubUrl && (
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm me-2">
                            GitHub
                          </a>
                        )}
                        {profile?.portfolioUrl && (
                          <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm">
                            Portfolio
                          </a>
                        )}
                      </div>
                    </Col>
                    <Col md={4}>
                      <Card>
                        <Card.Header>Account Status</Card.Header>
                        <Card.Body>
                          <p><strong>Email Verified:</strong> {profile?.isEmailVerified ? 'Yes' : 'No'}</p>
                          <p><strong>Account Active:</strong> {profile?.isActive ? 'Yes' : 'No'}</p>
                          <p><strong>Member Since:</strong> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 