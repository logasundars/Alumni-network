import React, { useState, useEffect } from 'react';
import './Jobs.css';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: string;
  postedByName: string;
  applicationCount: number;
  createdAt: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    jobType: 'FULL_TIME' as const,
    experienceLevel: 'ENTRY_LEVEL' as const
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    company: '',
    jobType: '',
    experienceLevel: ''
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    console.log('Retrieved user email from localStorage:', email);
    if (email) {
      setUserEmail(email);
    } else {
      console.error('No user email found in localStorage');
    }
    loadJobs();
  }, []);

  useEffect(() => {
    console.log('showCreateForm state changed to:', showCreateForm);
  }, [showCreateForm]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        setError('Failed to load jobs');
      }
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const validateJobForm = () => {
    const errors: any = {};
    if (!jobForm.title.trim()) errors.title = 'Job Title is required.';
    if (!jobForm.company.trim()) errors.company = 'Company is required.';
    if (!jobForm.description.trim()) errors.description = 'Description is required.';
    if (!jobForm.jobType) errors.jobType = 'Job Type is required.';
    if (!jobForm.experienceLevel) errors.experienceLevel = 'Experience Level is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createJobPosting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateJobForm()) return;
    console.log('Form submission triggered!');
    
    if (!userEmail) {
      console.error('No user email found');
      setError('User email not found. Please log in again.');
      return;
    }
    
    console.log('Form data:', jobForm);
    console.log('User email:', userEmail);
    
    try {
      const requestBody = JSON.stringify(jobForm);
      console.log('Request body:', requestBody);
      
      const response = await fetch(`/api/jobs?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const createdJob = await response.json();
        console.log('Job created successfully:', createdJob);
        
        setShowCreateForm(false);
        setJobForm({
          title: '', 
          description: '', 
          company: '', 
          location: '', 
          jobType: 'FULL_TIME', 
          experienceLevel: 'ENTRY_LEVEL'
        });
        setError(''); // Clear any previous errors
        loadJobs();
        alert('Job posted successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to create job posting:', errorText);
        setError(`Failed to create job posting: ${errorText}`);
      }
    } catch (err) {
      console.error('Error creating job posting:', err);
      setError('Failed to create job posting. Please try again.');
    }
  };

  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
    return 'Not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const deleteJobPosting = async (jobId: number) => {
    if (!userEmail) {
      setError('User email not found. Please log in again.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const response = await fetch(`/api/jobs/${jobId}?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setError('');
        loadJobs();
      } else {
        const errorText = await response.text();
        setError(`Failed to delete job posting: ${errorText}`);
      }
    } catch (err) {
      setError('Failed to delete job posting. Please try again.');
    }
  };

  if (loading) {
    return <div className="jobs-container">Loading jobs...</div>;
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2>Job Board</h2>
        <div className="jobs-tabs">
          <button 
            className={activeTab === 'browse' ? 'active' : ''} 
            onClick={() => setActiveTab('browse')}
          >
            Browse Jobs
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'browse' && (
        <div className="jobs-browse">
          <div className="jobs-search-filter">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className="create-job-btn"
              onClick={() => {
                console.log('Post a Job button clicked!');
                console.log('Current showCreateForm state:', showCreateForm);
                setShowCreateForm(true);
                console.log('Setting showCreateForm to true');
              }}
            >
              Post a Job
            </button>
          </div>

          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="no-jobs">No jobs found</div>
            ) : (
              jobs.map(job => {
                console.log('Job:', job, 'userEmail:', userEmail);
                return (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <h3>{job.title}</h3>
                      <span className="status-badge">{job.status}</span>
                    </div>
                    
                    <div className="job-company">{job.company}</div>
                    <div className="job-location">{job.location}</div>
                    
                    <div className="job-details">
                      <span className="job-type">{job.jobType.replace('_', ' ')}</span>
                      <span className="experience-level">{job.experienceLevel.replace('_', ' ')}</span>
                      <span className="salary">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                    </div>
                    
                    <div className="job-description">
                      {job.description.length > 200 
                        ? `${job.description.substring(0, 200)}...` 
                        : job.description
                      }
                    </div>
                    
                    <div className="job-footer">
                      <div className="job-meta">
                        <span>Posted by: {job.postedByName}</span>
                        <span>Applications: {job.applicationCount}</span>
                        <span>Posted: {formatDate(job.createdAt)}</span>
                      </div>
                      {userEmail && job.postedByName === userEmail && (
                        <button className="delete-job-btn" onClick={() => deleteJobPosting(job.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Create Job Form Modal */}
      {showCreateForm && (
        <div className="jobs-modal-overlay" style={{zIndex: 9999}}>
          <div className="jobs-modal" style={{zIndex: 10000}}>
            <div className="modal-header">
              <h3>Post a New Job</h3>
              <button onClick={() => {
                console.log('Closing modal');
                setShowCreateForm(false);
              }}>&times;</button>
            </div>
            
            <form onSubmit={createJobPosting} className="job-form">
              <input
                type="text"
                placeholder="Job Title *"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                required
              />
              {formErrors.title && <div className="field-error">{formErrors.title}</div>}
              
              <input
                type="text"
                placeholder="Company *"
                value={jobForm.company}
                onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                required
              />
              {formErrors.company && <div className="field-error">{formErrors.company}</div>}
              
              <input
                type="text"
                placeholder="Location"
                value={jobForm.location}
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
              />
              
              <select
                value={jobForm.jobType}
                onChange={(e) => setJobForm({...jobForm, jobType: e.target.value as any})}
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
              {formErrors.jobType && <div className="field-error">{formErrors.jobType}</div>}
              
              <select
                value={jobForm.experienceLevel}
                onChange={(e) => setJobForm({...jobForm, experienceLevel: e.target.value as any})}
                required
              >
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </select>
              {formErrors.experienceLevel && <div className="field-error">{formErrors.experienceLevel}</div>}
              
              <textarea
                placeholder="Job Description *"
                value={jobForm.description}
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                required
              />
              {formErrors.description && <div className="field-error">{formErrors.description}</div>}
              
              <div className="form-actions">
                <button type="submit">Post Job</button>
                <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs; 