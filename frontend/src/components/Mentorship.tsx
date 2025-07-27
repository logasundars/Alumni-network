import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Chip, 
    Avatar, 
    Box,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { 
    Person, 
    School, 
    Work, 
    Business, 
    Psychology, 
    Group, 
    Assignment, 
    Description, 
    Lightbulb, 
    TrendingUp,
    Send,
    CheckCircle,
    Schedule,
    LocationOn
} from '@mui/icons-material';
import './Mentorship.css';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface MentorshipApplication {
    id: number;
    mentor: User;
    applicant: User;
    type: string;
    status: string;
    title: string;
    motivation: string;
    goals?: string;
    currentSkills?: string;
    desiredSkills?: string;
    preferredCommunication?: string;
    availability?: string;
    durationMonths?: number;
    meetingFrequency?: string;
    additionalNotes?: string;
    mentorResponse?: string;
    createdAt: string;
    updatedAt?: string;
    respondedAt?: string;
}

interface Mentorship {
    id: number;
    mentor: User;
    mentee: User;
    type: string;
    status: string;
    title: string;
    description?: string;
    durationMonths?: number;
    meetingFrequency?: string;
    preferredCommunication?: string;
    areasOfExpertise?: string;
    goals?: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
}

const Mentorship: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [mentors, setMentors] = useState<User[]>([]);
    const [myMentorships, setMyMentorships] = useState<Mentorship[]>([]);
    const [myApplications, setMyApplications] = useState<MentorshipApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
    const [applicationForm, setApplicationForm] = useState({
        title: '',
        type: '',
        motivation: '',
        goals: '',
        currentSkills: '',
        desiredSkills: '',
        preferredCommunication: '',
        availability: '',
        durationMonths: 3,
        meetingFrequency: 'Weekly',
        additionalNotes: ''
    });
    // Add state for registration counts
    const [registrationCounts, setRegistrationCounts] = useState<{ [mentorId: number]: number }>({});

    const mentorshipTypes = [
        { value: 'CAREER_GUIDANCE', label: 'Career Guidance', icon: <Work />, color: '#2196F3' },
        { value: 'TECHNICAL_SKILLS', label: 'Technical Skills', icon: <Assignment />, color: '#4CAF50' },
        { value: 'LEADERSHIP', label: 'Leadership Development', icon: <TrendingUp />, color: '#FF9800' },
        { value: 'ENTREPRENEURSHIP', label: 'Entrepreneurship', icon: <Business />, color: '#9C27B0' },
        { value: 'NETWORKING', label: 'Networking', icon: <Group />, color: '#607D8B' },
        { value: 'INTERVIEW_PREPARATION', label: 'Interview Preparation', icon: <Person />, color: '#E91E63' },
        { value: 'RESUME_REVIEW', label: 'Resume Review', icon: <Description />, color: '#795548' },
        { value: 'SOFT_SKILLS', label: 'Soft Skills', icon: <Psychology />, color: '#00BCD4' },
        { value: 'INDUSTRY_INSIGHTS', label: 'Industry Insights', icon: <Lightbulb />, color: '#FF5722' },
        { value: 'ACADEMIC_GUIDANCE', label: 'Academic Guidance', icon: <School />, color: '#3F51B5' }
    ];

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchMentors();
        fetchMyMentorships();
        fetchMyApplications();
    }, []);

    // Fetch registration count for alumni
    const fetchRegistrationCount = async (mentorId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/mentorship/applications/count/${mentorId}`);
            if (response.ok) {
                const count = await response.json();
                setRegistrationCounts(prev => ({ ...prev, [mentorId]: count }));
            }
        } catch (error) {
            // ignore
        }
    };

    // Fetch counts for alumni on mount
    useEffect(() => {
        if (currentUser.role === 'ALUMNI' || currentUser.role === 'ADMIN') {
            fetchRegistrationCount(currentUser.id);
        }
    }, [currentUser.id, currentUser.role]);

    const fetchMentors = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/alumni');
            if (response.ok) {
                const data = await response.json();
                setMentors(data);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
        }
    };

    const fetchMyMentorships = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/mentorship/user/${currentUser.id}`);
            if (response.ok) {
                const data = await response.json();
                setMyMentorships(data);
            }
        } catch (error) {
            console.error('Error fetching mentorships:', error);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/mentorship/applications/applicant/${currentUser.id}`);
            if (response.ok) {
                const data = await response.json();
                setMyApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleApplyForMentorship = (mentor: User) => {
        setSelectedMentor(mentor);
        setApplicationDialogOpen(true);
    };

    const handleApplicationSubmit = async () => {
        if (!selectedMentor) return;

        try {
            const response = await fetch('http://localhost:8080/api/mentorship/applications/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mentor: selectedMentor,
                    applicant: currentUser,
                    ...applicationForm
                }),
            });

            if (response.ok) {
                setApplicationDialogOpen(false);
                setApplicationForm({
                    title: '',
                    type: '',
                    motivation: '',
                    goals: '',
                    currentSkills: '',
                    desiredSkills: '',
                    preferredCommunication: '',
                    availability: '',
                    durationMonths: 3,
                    meetingFrequency: 'Weekly',
                    additionalNotes: ''
                });
                fetchMyApplications();
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'PENDING': return 'warning';
            case 'COMPLETED': return 'info';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    const getTypeInfo = (type: string) => {
        return mentorshipTypes.find(t => t.value === type) || mentorshipTypes[0];
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className="mentorship-container">
            <Typography variant="h3" component="h1" gutterBottom className="mentorship-title">
                Mentorship Network
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
                Connect with experienced alumni for guidance and support
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="mentorship tabs">
                    <Tab label="Find Mentors" />
                    <Tab label="My Mentorships" />
                    <Tab label="My Applications" />
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Find Mentors Tab */}
            {tabValue === 0 && (
                <Grid container spacing={3}>
                    {mentors.map((mentor) => (
                        <Grid item xs={12} md={6} lg={4} key={mentor.id}>
                            <Card className="mentor-card">
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar className="mentor-avatar">
                                            {mentor.firstName.charAt(0)}{mentor.lastName.charAt(0)}
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">
                                                {mentor.firstName} {mentor.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {mentor.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Available for mentorship in various areas including:
                                    </Typography>
                                    
                                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                        {mentorshipTypes.slice(0, 4).map((type) => (
                                            <Chip
                                                key={type.value}
                                                icon={type.icon}
                                                label={type.label}
                                                size="small"
                                                className="mentorship-type-chip"
                                                style={{ backgroundColor: type.color, color: 'white' }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    {currentUser.role === 'STUDENT' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Send />}
                                            onClick={() => handleApplyForMentorship(mentor)}
                                            fullWidth
                                        >
                                            Apply for Mentorship
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* My Mentorships Tab */}
            {tabValue === 1 && (
                <Grid container spacing={3}>
                    {myMentorships.length === 0 ? (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" textAlign="center" color="textSecondary">
                                        You don't have any active mentorships yet.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : (
                        myMentorships.map((mentorship) => {
                            const typeInfo = getTypeInfo(mentorship.type);
                            return (
                                <Grid item xs={12} md={6} key={mentorship.id}>
                                    <Card className="mentorship-card">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="h6">{mentorship.title}</Typography>
                                                <Chip
                                                    label={mentorship.status}
                                                    color={getStatusColor(mentorship.status) as any}
                                                    size="small"
                                                />
                                            </Box>
                                            {/* Registration count for alumni */}
                                            {(currentUser.role === 'ALUMNI' || currentUser.role === 'ADMIN') && (
                                                <Typography variant="body2" color="primary" mb={1}>
                                                    Student Registrations: {registrationCounts[currentUser.id] ?? 0}
                                                </Typography>
                                            )}
                                            
                                            <Box display="flex" alignItems="center" mb={1}>
                                                {typeInfo.icon}
                                                <Typography variant="body2" ml={1}>
                                                    {typeInfo.label}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Mentor: {mentorship.mentor.firstName} {mentorship.mentor.lastName}
                                            </Typography>
                                            
                                            {mentorship.description && (
                                                <Typography variant="body2" paragraph>
                                                    {mentorship.description}
                                                </Typography>
                                            )}
                                            
                                            <Box display="flex" gap={2} flexWrap="wrap">
                                                {mentorship.meetingFrequency && (
                                                    <Chip
                                                        icon={<Schedule />}
                                                        label={mentorship.meetingFrequency}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                                {mentorship.durationMonths && (
                                                    <Chip
                                                        icon={<CheckCircle />}
                                                        label={`${mentorship.durationMonths} months`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            )}

            {/* My Applications Tab */}
            {tabValue === 2 && (
                <Grid container spacing={3}>
                    {myApplications.length === 0 ? (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" textAlign="center" color="textSecondary">
                                        You haven't applied for any mentorships yet.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : (
                        myApplications.map((application) => {
                            const typeInfo = getTypeInfo(application.type);
                            return (
                                <Grid item xs={12} md={6} key={application.id}>
                                    <Card className="application-card">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="h6">{application.title}</Typography>
                                                <Chip
                                                    label={application.status}
                                                    color={getStatusColor(application.status) as any}
                                                    size="small"
                                                />
                                            </Box>
                                            
                                            <Box display="flex" alignItems="center" mb={1}>
                                                {typeInfo.icon}
                                                <Typography variant="body2" ml={1}>
                                                    {typeInfo.label}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Mentor: {application.mentor.firstName} {application.mentor.lastName}
                                            </Typography>
                                            
                                            <Typography variant="body2" paragraph>
                                                {application.motivation}
                                            </Typography>
                                            
                                            {application.mentorResponse && (
                                                <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Mentor Response:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {application.mentorResponse}
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            <Typography variant="caption" color="textSecondary">
                                                Applied on: {new Date(application.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            )}

            {/* Application Dialog */}
            <Dialog 
                open={applicationDialogOpen} 
                onClose={() => setApplicationDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Apply for Mentorship with {selectedMentor?.firstName} {selectedMentor?.lastName}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Application Title"
                                value={applicationForm.title}
                                onChange={(e) => setApplicationForm({...applicationForm, title: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Mentorship Type</InputLabel>
                                <Select
                                    value={applicationForm.type}
                                    onChange={(e) => setApplicationForm({...applicationForm, type: e.target.value})}
                                    label="Mentorship Type"
                                >
                                    {mentorshipTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Duration (months)"
                                type="number"
                                value={applicationForm.durationMonths}
                                onChange={(e) => setApplicationForm({...applicationForm, durationMonths: parseInt(e.target.value)})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Why do you want this mentorship?"
                                multiline
                                rows={3}
                                value={applicationForm.motivation}
                                onChange={(e) => setApplicationForm({...applicationForm, motivation: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="What are your goals?"
                                multiline
                                rows={2}
                                value={applicationForm.goals}
                                onChange={(e) => setApplicationForm({...applicationForm, goals: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Current Skills"
                                multiline
                                rows={2}
                                value={applicationForm.currentSkills}
                                onChange={(e) => setApplicationForm({...applicationForm, currentSkills: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Desired Skills"
                                multiline
                                rows={2}
                                value={applicationForm.desiredSkills}
                                onChange={(e) => setApplicationForm({...applicationForm, desiredSkills: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Preferred Communication"
                                value={applicationForm.preferredCommunication}
                                onChange={(e) => setApplicationForm({...applicationForm, preferredCommunication: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Meeting Frequency"
                                value={applicationForm.meetingFrequency}
                                onChange={(e) => setApplicationForm({...applicationForm, meetingFrequency: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Your Availability"
                                multiline
                                rows={2}
                                value={applicationForm.availability}
                                onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Additional Notes"
                                multiline
                                rows={2}
                                value={applicationForm.additionalNotes}
                                onChange={(e) => setApplicationForm({...applicationForm, additionalNotes: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApplicationDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleApplicationSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={!applicationForm.title || !applicationForm.type || !applicationForm.motivation}
                    >
                        Submit Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Mentorship; 