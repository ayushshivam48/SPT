import { useEffect, useState } from 'react';
import AdminSidebar from '../../Shared/Slidebars/Admin';
import api from '../../api';

// Define types for our data structures
interface Subject {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface TimetableEntry {
  day: string;
  period: string;
  subject: string;
  teacher: string;
}

const hours = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const courses = ['BCA', 'B.Tech'];

const AdminTimetableManager = () => {
  const [mode, setMode] = useState('view');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, Record<string, { subject: string; teacher: string }>>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (course === 'BCA') setAvailableSemesters(['1', '2', '3', '4', '5', '6']);
    else if (course === 'B.Tech') setAvailableSemesters(['1', '2', '3', '4', '5', '6', '7', '8']);
    else setAvailableSemesters([]);
  }, [course]);

  useEffect(() => {
    if (!course || !semester) { setSubjects([]); return; }
    setLoadingSubjects(true); setError('');
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects/filter', { params: { course, semester } });
        const data = Array.isArray(response) ? response : (response.data || []);
        setSubjects(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to load subjects');
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [course, semester]);

  useEffect(() => {
    if (!course) { setTeachers([]); return; }
    setLoadingTeachers(true); setError('');
    const fetchTeachers = async () => {
      try {
        const response = await api.get(`/teachers/filter?assignedCourse=${encodeURIComponent(course)}`);
        const data = Array.isArray(response) ? response : (response.data || []);
        setTeachers(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to load teachers');
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, [course]);

  useEffect(() => {
    if (!course || !semester) { setTableData({}); return; }
    if (mode === 'view') {
      setLoadingTimetable(true); setError('');
      const fetchTimetable = async () => {
        try {
          const response = await api.get('/timetables/filter', { params: { role: 'admin', course, semester } });
          const data = Array.isArray(response) ? response : (response.data || []);
          const initial: Record<string, Record<string, { subject: string; teacher: string }>> = {};
          days.forEach((d) => {
            initial[d] = {};
            hours.forEach((h) => {
              initial[d][h] = { subject: '', teacher: '' };
            });
          });
          (data as TimetableEntry[]).forEach((entry) => {
            if (initial[entry.day] && entry.period in initial[entry.day]) {
              initial[entry.day][entry.period] = { subject: entry.subject, teacher: entry.teacher };
            }
          });
          setTableData(initial);
        } catch (err) {
          setTableData({});
          setError((err as Error).message || 'Failed to load timetable');
        } finally {
          setLoadingTimetable(false);
        }
      };
      fetchTimetable();
    } else {
      const initial: Record<string, Record<string, { subject: string; teacher: string }>> = {};
      days.forEach((d) => {
        initial[d] = {};
        hours.forEach((h) => {
          initial[d][h] = { subject: '', teacher: '' };
        });
      });
      setTableData(initial);
    }
  }, [mode, course, semester]);

  const handleChange = (day: string, hour: string, field: 'subject' | 'teacher', value: string | Subject | Teacher) => {
    // Extract ID if value is an object
    const id = typeof value === 'object' && value !== null ? value._id : value;
    
    setTableData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: {
          ...prev[day][hour],
          [field]: id || ''
        }
      }
    }));
  };

  const handleSave = async () => {
    setError('');
    const entries: Array<{ day: string; period: string; subject: string; teacher: string; course: string; semester: number }> = [];
    Object.entries(tableData).forEach(([day, periods]) => {
      Object.entries(periods).forEach(([period, cell]) => {
        if (period !== '01:00 - 02:00' && cell && 
          typeof cell.subject === 'string' && cell.subject !== '' &&
          typeof cell.teacher === 'string' && cell.teacher !== '') {
          entries.push({
            day,
            period,
            subject: cell.subject,
            teacher: cell.teacher,
            course,
            semester: parseInt(semester, 10),
          });
        }
      });
    });
    if (!entries.length) { setError('No valid timetable entries to save.'); return; }
    await api.post('/timetables', entries);
    alert('Timetable saved successfully!');
    setMode('view');
  };

  const handleClearCell = (day: string, hour: string) => {
    setTableData((prev) => ({ ...prev, [day]: { ...prev[day], [hour]: { subject: '', teacher: '' } } }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Timetable Manager</h1>
          <select className="p-2 border rounded" value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Select mode">
            <option value="view">View Saved</option>
            <option value="add">Add New</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select className="p-2 border rounded" value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Select course">
            <option value="">Select Course</option>
            {courses.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <select className="p-2 border rounded" value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Select semester">
            <option value="">Select Semester</option>
            {availableSemesters.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        {error && (<div className="mb-4 p-2 rounded bg-red-200 text-red-800">{error}</div>)}
        {(loadingSubjects || loadingTeachers || loadingTimetable) && (<div className="mb-4 p-2 rounded bg-yellow-100 text-yellow-800">Loading...</div>)}

        {course && semester && (
          <>
            <div className="overflow-auto bg-white rounded shadow">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th className="border p-2">Day / Time</th>
                    {hours.map((h) => (<th key={h} className="border p-2">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td className="border p-2 font-semibold">{day}</td>
                      {hours.map((hour) => {
                        const cell = tableData[day]?.[hour];
                        if (hour === '01:00 - 02:00') return (<td key={hour} className="border p-2 bg-gray-100 text-center font-medium text-gray-600">Free Time</td>);
                        if (mode === 'add') return (
                          <td key={hour} className="border p-1">
                            <select className="w-full mb-1" value={cell?.subject || ''} onChange={(e) => { const selected = subjects.find((s) => s._id === e.target.value); handleChange(day, hour, 'subject', selected || e.target.value); }} disabled={loadingSubjects} aria-label={`${day} ${hour} - select subject`}>
                              <option value="">Select Subject</option>
                              {subjects.map((s) => (<option key={s._id} value={s._id}>{s.name}</option>))}
                            </select>
                            <select className="w-full" value={cell?.teacher || ''} onChange={(e) => { const selected = teachers.find((t) => t._id === e.target.value); handleChange(day, hour, 'teacher', selected || e.target.value); }} disabled={loadingTeachers} aria-label={`${day} ${hour} - select teacher`}>
                              <option value="">Select Teacher</option>
                              {teachers.map((t) => (<option key={t._id} value={t._id}>{t.name}</option>))}
                            </select>
                            <button type="button" onClick={() => handleClearCell(day, hour)} disabled={loadingSubjects || loadingTeachers} className="text-red-600 text-xs mt-1" aria-label={`Clear entry for ${day} ${hour}`}>Clear</button>
                          </td>
                        );
                        if (!cell || !cell.subject) return (<td key={hour} className="border p-2 text-center text-gray-400 italic" aria-label={`${day} ${hour} - no class`}>--</td>);
                        return (
                          <td key={hour} className="border p-2 text-center bg-blue-100" title={cell.teacher} aria-label={`${day} ${hour} - subject ${cell.subject}`}>
                            <div className="font-semibold">{cell.subject}</div>
                            <small className="block text-gray-700">{cell.teacher || '-'}</small>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {mode === 'add' && (
              <button type="button" onClick={handleSave} disabled={loadingSubjects || loadingTeachers} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Save timetable">Upload & Save Timetable</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTimetableManager;
