import React, { useEffect, useState } from "react";
import './ReportIssue.css';

const ReportedIssues = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;
    const token = localStorage.getItem("jwtoken");



    useEffect(() => {
        const fetchReports = async () => {
            try {

                const response = await fetch(`${apiUrl}/android/reported-issues`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch reported issues");
                }

                const data = await response.json();
                setReports(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleDeleteReport = async (reportId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this report?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${apiUrl}/report/reported-issues/${reportId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // same as your GET request
                },
            });

            if (!response.ok) throw new Error("Failed to delete report");

            // Update the UI
            setReports((prev) => prev.filter((report) => report._id !== reportId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete report.");
        }
    };


    return (
        <div className="reportedIssueContainer">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && reports.length === 0 ? (
                <p className="text-gray-500 text-center">No reported issues found.</p>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg text-sm">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4 border">App Name</th>
                                <th className="py-2 px-4 border">Version</th>
                                <th className="py-2 px-4 border">Reported By</th>
                                <th className="py-2 px-4 border">Url</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="text-center border-b hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{report.appName}</td>
                                    <td className="py-2 px-4 border">{report.appVersion}</td>
                                    <td className="py-2 px-4 border">{report.reportedBy?.email || "Unknown"}</td>
                                    <td className="py-2 px-4 border truncate max-w-[180px]">
                                        <a
                                            href={report.targetUrl}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {report.targetUrl}
                                        </a>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDeleteReport(report._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>


    );
};

export default ReportedIssues;
