import { useEffect, useState } from 'react';
import TeacherSidebar from '../../Shared/Slidebars/Teacher';
import api from '../../api';

interface Assignment {
  course: string;
  semester: number;
  subject: string;
  teacherId?: string;
  teacherName?: string;
  _id?: string;
}

interface Announcement {
  course: string;
  semester: number;
  subject: string;
  message: string;
  date?: Date;
  createdAt?: Date;
  _id?: string;
}

const AnnouncementPanel = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoadingAssignments(true);
      setErrorMsg('');
      try {
        const data = await api.get('/assignments/filter');
        const assignmentsData = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        setAssignments(assignmentsData);
        setSelected(assignmentsData.length ? assignmentsData[0] : null);
      } catch {
        setAssignments([]);
        setSelected(null);
        setErrorMsg('Failed to load assignments.');
      } finally {
        setLoadingAssignments(false);
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!selected) {
        setAnnouncements([]);
        return;
      }
      setLoadingAnnouncements(true);
      setErrorMsg('');
      try {
        const data = await api.get(`/announcements?course=${selected.course}&semester=${selected.semester}&subject=${selected.subject}`);
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch {
        setAnnouncements([]);
        setErrorMsg('Failed to load announcements.');
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [selected]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim() || !selected) return;
    
    setPostingAnnouncement(true);
    setErrorMsg('');
    try {
      const payload = {
        course: selected.course,
        semester: selected.semester,
        subject: selected.subject,
        message: newAnnouncement.trim()
      };
      await api.post('/announcements', payload);
      setNewAnnouncement('');
      
      // Refresh announcements after posting
      const updated = await api.get(`/announcements?course=${selected.course}&semester=${selected.semester}&subject=${selected.subject}`);
      setAnnouncements(Array.isArray(updated) ? updated : []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to post announcement.';
      alert(errorMessage);
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await api.delete(`/announcements/${announcementId}`);
      // Refresh the announcements list
      if (selected) {
        const updated = await api.get(`/announcements?course=${selected.course}&semester=${selected.semester}&subject=${selected.subject}`);
        setAnnouncements(Array.isArray(updated) ? updated : []);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete announcement.';
      alert(errorMessage);
    }
  };

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<TeacherSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">📢 Announcements</h1>
					{errorMsg && (<div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>)}
					<section className="bg-white rounded-xl shadow p-4 mb-6">
						<h2 className="text-lg font-semibold text-gray-700 mb-3">🎯 Select Course Info</h2>
						{loadingAssignments ? (<p>Loading course assignments...</p>) : assignments.length === 0 ? (<p>No assignments available.</p>) : (
							<select className="px-4 py-2 border rounded w-72" aria-label="Select assignment" value={selected ? JSON.stringify(selected) : ''} onChange={(e) => setSelected(JSON.parse(e.target.value))}>
								{assignments.map((a, idx) => (<option key={idx} value={JSON.stringify(a)}>{a.course} - Sem {a.semester} - {a.subject}</option>))}
							</select>
						)}
					</section>
					<section className="bg-white rounded-xl shadow p-4 mb-6">
						<h2 className="text-lg font-semibold text-gray-700 mb-3">✏️ Add Announcement</h2>
						<form onSubmit={handleAdd}>
							<textarea className="w-full rounded border p-2 resize-none h-24 mb-3" placeholder="Type your announcement here..." value={newAnnouncement} onChange={(e) => setNewAnnouncement(e.target.value)} disabled={!selected || postingAnnouncement} aria-label="Announcement text" />
							<div className="text-right">
								<button type="submit" disabled={postingAnnouncement || !newAnnouncement.trim() || !selected} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{postingAnnouncement ? 'Posting...' : 'Post Announcement'}</button>
							</div>
						</form>
					</section>
					<section className="bg-white rounded-xl shadow p-4">
						<h2 className="text-lg font-semibold text-gray-700 mb-3">📜 Previous Announcements</h2>
						{loadingAnnouncements ? (<p>Loading announcements...</p>) : announcements.length === 0 ? (<p className="italic text-gray-500">No announcements yet.</p>) : (
							announcements.map((a, idx) => (
								<article key={idx} className="border border-gray-200 rounded p-4 mb-3 bg-gray-50 shadow-sm relative" aria-live="polite">
									<p className="text-gray-800 whitespace-pre-wrap">{a.message}</p>
									<p className="text-xs text-gray-500 mt-2">📅 {new Date(a.date || a.createdAt || Date.now()).toLocaleDateString()} — {a.course} Sem {a.semester} — {a.subject}</p>
									{a._id && (
										<button
											onClick={() => handleDeleteAnnouncement(a._id!)}
											className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
											title="Delete announcement"
										>
											🗑️
										</button>
									)}
								</article>
							))
						)}
					</section>
				</main>
			</div>
		</div>
	);
};

export default AnnouncementPanel;