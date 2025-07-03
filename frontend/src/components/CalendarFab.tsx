import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarPage from './Calendar';
import './CalendarFab.css';

const CalendarFab: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className="calendar-fab" onClick={() => setShow(true)}>
        <CalendarMonthIcon style={{ fontSize: 28 }} />
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="xl"
        contentClassName="calendar-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>Events & Jobs Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarPage />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarFab; 