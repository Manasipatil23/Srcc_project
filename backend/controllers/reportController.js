import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import Therapist from '../models/Therapist.js';

const toCsv = (rows, columns) => {
  const escape = (value) => {
    const str = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const header = columns.map((c) => escape(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(',')).join('\n');
  return `${header}\n${body}`;
};

const sendReport = (res, format, filename, rows, columns) => {
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    return res.send(toCsv(rows, columns));
  }
  return res.json({ success: true, count: rows.length, data: rows });
};

const dateFilter = (query) => {
  const filter = {};
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = query.from;
    if (query.to) filter.date.$lte = query.to;
  }
  return filter;
};

// GET /api/reports/appointments?from=&to=&status=&format=csv|json
export const appointmentsReport = async (req, res, next) => {
  try {
    const filter = dateFilter(req.query);
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 }).lean();
    const rows = appointments.map((a) => ({
      date: a.date,
      time: a.time,
      patientName: a.patientName,
      therapistName: a.therapistName,
      type: a.type,
      status: a.status,
    }));

    sendReport(res, req.query.format, `srcc-appointments-report`, rows, [
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'patientName', label: 'Patient' },
      { key: 'therapistName', label: 'Therapist' },
      { key: 'type', label: 'Service Type' },
      { key: 'status', label: 'Status' },
    ]);
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/payments?from=&to=&status=&format=csv|json
export const paymentsReport = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from || req.query.to) {
      filter.appointmentDate = {};
      if (req.query.from) filter.appointmentDate.$gte = req.query.from;
      if (req.query.to) filter.appointmentDate.$lte = req.query.to;
    }

    const payments = await Payment.find(filter).sort({ appointmentDate: 1 }).lean();
    const rows = payments.map((p) => ({
      receiptNumber: p.receiptNumber || '-',
      appointmentDate: p.appointmentDate,
      patientName: p.patientName,
      therapistName: p.therapistName,
      serviceType: p.serviceType,
      amount: p.amount,
      mode: p.mode || '-',
      status: p.status,
      collectedAt: p.collectedAt ? new Date(p.collectedAt).toISOString().slice(0, 10) : '-',
    }));

    sendReport(res, req.query.format, `srcc-payments-report`, rows, [
      { key: 'receiptNumber', label: 'Receipt No.' },
      { key: 'appointmentDate', label: 'Appointment Date' },
      { key: 'patientName', label: 'Patient' },
      { key: 'therapistName', label: 'Therapist' },
      { key: 'serviceType', label: 'Service Type' },
      { key: 'amount', label: 'Amount (INR)' },
      { key: 'mode', label: 'Mode' },
      { key: 'status', label: 'Status' },
      { key: 'collectedAt', label: 'Collected On' },
    ]);
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/therapist-utilization?from=&to=&format=csv|json
export const therapistUtilizationReport = async (req, res, next) => {
  try {
    const filter = dateFilter(req.query);

    const [appointments, therapists] = await Promise.all([
      Appointment.find(filter).lean(),
      Therapist.find({}).lean(),
    ]);

    const rows = therapists.map((t) => {
      const own = appointments.filter((a) => String(a.therapistId) === String(t._id));
      const completed = own.filter((a) => a.status === 'Completed').length;
      const cancelled = own.filter((a) => a.status === 'Cancelled').length;
      return {
        therapistName: t.name,
        specialty: t.specialty,
        totalAppointments: own.length,
        completed,
        cancelled,
        upcoming: own.length - completed - cancelled,
      };
    });

    sendReport(res, req.query.format, `srcc-therapist-utilization-report`, rows, [
      { key: 'therapistName', label: 'Therapist' },
      { key: 'specialty', label: 'Specialty' },
      { key: 'totalAppointments', label: 'Total Appointments' },
      { key: 'completed', label: 'Completed' },
      { key: 'cancelled', label: 'Cancelled' },
      { key: 'upcoming', label: 'Upcoming' },
    ]);
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/summary?from=&to=
export const summaryReport = async (req, res, next) => {
  try {
    const apptFilter = dateFilter(req.query);
    const payFilter = {};
    if (req.query.from || req.query.to) {
      payFilter.appointmentDate = {};
      if (req.query.from) payFilter.appointmentDate.$gte = req.query.from;
      if (req.query.to) payFilter.appointmentDate.$lte = req.query.to;
    }

    const [appointments, payments, therapistCount] = await Promise.all([
      Appointment.find(apptFilter).lean(),
      Payment.find(payFilter).lean(),
      Therapist.countDocuments({}),
    ]);

    const byStatus = (list, key) =>
      list.reduce((acc, item) => {
        acc[item[key]] = (acc[item[key]] || 0) + 1;
        return acc;
      }, {});

    const revenue = payments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments
      .filter((p) => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: {
        range: { from: req.query.from || null, to: req.query.to || null },
        appointments: { total: appointments.length, byStatus: byStatus(appointments, 'status') },
        payments: {
          total: payments.length,
          byStatus: byStatus(payments, 'status'),
          revenueCollected: revenue,
          pendingAmount,
        },
        therapists: therapistCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
