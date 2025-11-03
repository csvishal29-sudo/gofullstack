import Report from '../models/report.model.js';

// Create a new report
export const createReport = async (req, res) => {
    try {
        const { issueType, comment, city, status, reportDate, photo } = req.body;

        const report = new Report({
            issueType,
            comment,
            city: city || "",
            status: status || 'Pending',
            reportDate: reportDate || new Date(),
            photo: photo || null,
            userId: req.userId
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        console.error('Report creation error:', error);
        res.status(500).json({ message: 'Error creating report', error: error.message });
    }
};

// Get all reports
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
};

// Update report status
export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating report', error: error.message });
    }
};