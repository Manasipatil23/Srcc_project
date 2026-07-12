import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const startReminderJob = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('Running appointment reminder job...');
      const now = new Date();
      const appointments = await Appointment.find({ status: 'Upcoming' });

      for (const apt of appointments) {
        if (!apt.patientId) continue;
        
        // Parse appointment date and time
        // Date is "YYYY-MM-DD", time is "HH:mm" (24h or 12h?)
        // Let's assume standard parsing or basic comparison
        const [hours, minutes] = apt.time.split(':');
        const isPM = apt.time.toLowerCase().includes('pm');
        let parsedHours = parseInt(hours, 10);
        if (isPM && parsedHours < 12) parsedHours += 12;
        if (!isPM && parsedHours === 12) parsedHours = 0;
        
        const aptDateStr = apt.date; // YYYY-MM-DD
        const timeStr = `${parsedHours.toString().padStart(2, '0')}:${minutes.replace(/[^0-9]/g, '')}:00`;
        const aptDateTime = new Date(`${aptDateStr}T${timeStr}`);
        
        const timeDiffMs = aptDateTime - now;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        // 24 Hour Reminder (Between 23.75 and 24.25 hours from now)
        if (timeDiffHours > 0 && timeDiffHours <= 24.5 && !apt.reminder24hSent) {
          await Notification.create({
            targetUserId: apt.patientId,
            title: 'Appointment Reminder (24h)',
            message: `Reminder: You have an upcoming ${apt.type} with ${apt.therapistName} tomorrow at ${apt.time}.`,
            type: 'alert'
          });
          
          // Optional: We can add an email here if we have a mailer service integrated
          // await mailer.sendMail(user.email, 'Reminder', '...', ...);

          apt.reminder24hSent = true;
          await apt.save();
          console.log(`Sent 24h reminder to patient ${apt.patientId} for appointment ${apt._id}`);
        }

        // 1 Hour Reminder
        if (timeDiffHours > 0 && timeDiffHours <= 1.25 && !apt.reminder1hSent) {
          await Notification.create({
            targetUserId: apt.patientId,
            title: 'Appointment Reminder (1h)',
            message: `Reminder: Your ${apt.type} with ${apt.therapistName} starts in less than 1 hour at ${apt.time}.`,
            type: 'alert'
          });

          apt.reminder1hSent = true;
          await apt.save();
          console.log(`Sent 1h reminder to patient ${apt.patientId} for appointment ${apt._id}`);
        }
      }
    } catch (error) {
      console.error('Error running reminder job:', error);
    }
  });
};

export default startReminderJob;
