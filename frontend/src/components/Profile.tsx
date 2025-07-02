import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import './Profile.css';

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
  onProfileUpdate?: (updatedProfile: any) => void;
}

const FaLinkedinIcon = FaLinkedin as any;
const FaGithubIcon = FaGithub as any;
const FaGlobeIcon = FaGlobe as any;

// Helper to get the correct profile image URL
const getProfileImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith('/uploads/')) {
    return `http://localhost:8080${url}`;
  }
  return url;
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onProfileUpdate }) => {
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const defaultCover = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

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
        setImagePreview(profileData.profilePicture || null);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Network error while loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    let profilePictureUrl = profile?.profilePicture || '';
    // If a new image is selected, upload it first
    if (selectedImage) {
      const formDataImg = new FormData();
      formDataImg.append('email', user.email);
      formDataImg.append('image', selectedImage);
      try {
        const uploadRes = await fetch('/api/profile/upload-image', {
          method: 'POST',
          body: formDataImg,
        });
        if (uploadRes.ok) {
          profilePictureUrl = await uploadRes.text();
        } else {
          setError('Failed to upload image');
          setSaving(false);
          return;
        }
      } catch (err) {
        setError('Network error while uploading image');
        setSaving(false);
        return;
      }
    }
    // Now update profile with new data and image URL
    try {
      const response = await fetch(`/api/profile?email=${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, profilePicture: profilePictureUrl }),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setSelectedImage(null);
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
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
    <div className="profile-page-modern">
      <div className="profile-header-bar-no-cover">
        <div className="profile-header-bar-inner-no-cover">
          <div className="profile-image-header-wrapper">
            {isEditing ? (
              <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                <img
                  src={getProfileImageUrl(imagePreview || profile?.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.firstName || 'U') + '+' + encodeURIComponent(profile?.lastName || 'N'))}
                  alt="Profile Preview"
                  className="profile-image-modern profile-image-edit"
                />
                <div className="profile-image-overlay">Change Photo</div>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <img
                src={getProfileImageUrl(profile?.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.firstName || 'U') + '+' + encodeURIComponent(profile?.lastName || 'N'))}
                alt="Profile"
                className="profile-image-modern"
              />
            )}
          </div>
          <div className="profile-header-main-modern">
            <div className="profile-header-main-info">
              <h2 className="profile-name-modern">{profile?.firstName} {profile?.lastName}</h2>
              <span className="profile-role-modern">{profile?.role}</span>
            </div>
          </div>
          <div className="profile-header-actions-modern">
            <Button 
              variant="outline-primary" 
              onClick={() => setIsEditing(!isEditing)}
              className="me-2 profile-edit-btn"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
            <Button variant="outline-danger" onClick={onLogout} className="profile-logout-btn">
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Details Card */}
      <div className="profile-details-card">
        <div className="profile-details-header">Personal details</div>
        <Card className="border-0 shadow profile-card-inner-modern">
          <Card.Body className="pt-0">
            {error && <Alert variant="danger" className="profile-alert">{error}</Alert>}
            {success && <Alert variant="success" className="profile-alert">{success}</Alert>}
            {isEditing ? (
              <Form onSubmit={handleSubmit} className="profile-form">
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="profile-input"
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
                    className="profile-input"
                  />
                </Form.Group>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Current Company</Form.Label>
                      <Form.Control
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="Your current company"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Current Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleChange}
                        placeholder="Your current position"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Graduation Year</Form.Label>
                      <Form.Control
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        placeholder="e.g., 2023"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Major</Form.Label>
                      <Form.Control
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        placeholder="e.g., Computer Science"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>LinkedIn</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>GitHub</Form.Label>
                      <Form.Control
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Portfolio</Form.Label>
                      <Form.Control
                        type="url"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://yourportfolio.com"
                        className="profile-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="profile-form-actions">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={saving}
                    className="me-2 profile-save-btn"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="profile-cancel-btn"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="profile-info-view-modern">
                <div className="profile-info-grid-modern">
                  <div><strong>Company:</strong> {profile?.currentCompany}</div>
                  <div><strong>Position:</strong> {profile?.currentPosition}</div>
                  <div><strong>Graduation Year:</strong> {profile?.graduationYear}</div>
                  <div><strong>Major:</strong> {profile?.major}</div>
                </div>
                <p className="profile-bio-modern text-muted">{profile?.bio}</p>
                <div className="profile-social-links mb-3">
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="me-3 profile-social-icon" title="LinkedIn">
                      <FaLinkedinIcon size={24} color="#0e76a8" />
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="me-3 profile-social-icon" title="GitHub">
                      <FaGithubIcon size={24} color="#333" />
                    </a>
                  )}
                  {profile?.portfolioUrl && (
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="profile-social-icon" title="Portfolio">
                      <FaGlobeIcon size={24} color="#007bff" />
                    </a>
                  )}
                </div>
                <div className="profile-meta-modern text-muted small">
                  <div>Joined: {profile?.createdAt?.slice(0, 10)}</div>
                  <div>Last Updated: {profile?.updatedAt?.slice(0, 10)}</div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 