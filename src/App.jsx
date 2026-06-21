import { useState, useEffect } from "react";
import {
  FaBook,
  FaTasks,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");//subject
  const [examDate, setExamDate] = useState("");//dates
  const [darkMode, setDarkMode] = useState(false);//toggle
  const [loaded, setLoaded] = useState(false);//storage
  const [currentMonth, setCurrentMonth] = useState(new Date());//calender
  const [minutes, setMinutes] = useState(25);//pomodoro timer
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("subjects");
    if (saved) setSubjects(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects, loaded]);

  useEffect(() => {
  let timer;

  if (isRunning) {
    timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setIsRunning(false);
        alert("Pomodoro Session Complete!");
      }
    }, 1000);
  }

  return () => clearInterval(timer);
}, [isRunning, minutes, seconds]);

  const addSubject = () => {
    if (!subjectName.trim() || !examDate) return;

    setSubjects((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: subjectName,
        examDate,
        tasks: [],
        newTask: "",
      },
    ]);

    setSubjectName("");
    setExamDate("");
  };

  const updateTaskInput = (subjectId, value) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, newTask: value } : s
      )
    );
  };

  const addTask = (subjectId) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;

        const text = s.newTask?.trim();
        if (!text) return s;

        return {
          ...s,
          tasks: [
            ...s.tasks,
            { id: crypto.randomUUID(), text, completed: false },
          ],
          newTask: "",
        };
      })
    );
  };

  const toggleTask = (subjectId, taskId) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              tasks: s.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : s
      )
    );
  };

  const deleteTask = (subjectId, taskId) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              tasks: s.tasks.filter((t) => t.id !== taskId),
            }
          : s
      )
    );
  };

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const totalTasks = subjects.reduce((a, s) => a + s.tasks.length, 0);

  const completedTasks = subjects.reduce(
    (a, s) => a + s.tasks.filter((t) => t.completed).length,
    0
  );

  const startTimer = () => {
  setIsRunning(true);
};

const pauseTimer = () => {
  setIsRunning(false);
};

const resetTimer = () => {
  setIsRunning(false);
  setMinutes(25);
  setSeconds(0);
};
  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const upcoming = [...subjects]
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .slice(0, 5);

    //calender logic
const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const generateCalendarDays = () => {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const days = [];

  for (let i = 1; i <= end.getDate(); i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return days;
};

const examsOnDate = (date) => {
  return subjects.filter(
    (s) =>
      new Date(s.examDate).toDateString() === date.toDateString()
  );
};
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
  return (
    <div
      className={`min-h-screen font-sans transition-all ${
        darkMode ? "bg-[#0f1115] text-gray-100" : "bg-[#f7f7f8] text-gray-900"
      }`}
    >
      {/* TOP BAR */}
      <div
        className={`flex justify-between items-center px-6 py-4 border-b ${
          darkMode ? "border-gray-800 bg-[#12151b]" : "bg-white border-gray-200"
        }`}
      >
        <h1 className="font-semibold text-lg tracking-tight">
          Study Planner
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1.5 rounded-md text-sm border ${
            darkMode
              ? "border-gray-700 hover:bg-gray-800"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* HERO */}
        <div
  className={`p-6 rounded-xl border ${
    darkMode
      ? "border-gray-800 bg-[#12151b]"
      : "bg-white border-gray-200"
  }`}
>
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

    <div>
      <h1 className="text-2xl font-semibold">
        Welcome Back 👋
      </h1>

     

      <p className="text-sm text-gray-500 mt-1">
        Your study dashboard is ready
      </p>
    </div>

    <div className="flex flex-wrap gap-4 text-sm">

      <div className="flex items-center gap-2">
        <FaBook className="text-blue-500" />
        <span>{subjects.length} Subjects</span>
      </div>

      <div className="flex items-center gap-2">
        <FaTasks className="text-purple-500" />
        <span>{totalTasks} Tasks</span>
      </div>

      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-500" />
        <span>{completedTasks} Done</span>
      </div>

      <div className="flex items-center gap-2">
        <FaChartLine className="text-orange-500" />
        <span>{progress}% Progress</span>
      </div>

    </div>

  </div>
</div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">

          {[{
            icon: <FaBook />,
            label: "Subjects",
            value: subjects.length,
          },{
            icon: <FaTasks />,
            label: "Tasks",
            value: totalTasks,
          },{
            icon: <FaCheckCircle />,
            label: "Completed",
            value: completedTasks,
          },{
            icon: <FaChartLine />,
            label: "Progress",
            value: `${progress}%`,
          }].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                darkMode ? "border-gray-800 bg-[#12151b]" : "bg-white border-gray-200"
              }`}
            >
              <div
  className={`p-3 rounded-xl ${
    darkMode
      ? "bg-blue-500/10 text-blue-400"
      : "bg-blue-50 text-blue-600"
  }`}
>
  {item.icon}
</div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
<h2 className="text-xl font-bold">
  {item.value}
</h2>
              </div>
            </div>
          ))}
        </div>
<div
  className={`p-6 rounded-xl shadow mb-6 text-center ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
  <h2 className="text-xl font-bold mb-3">
    Pomodoro Timer
  </h2>

  <div className="text-5xl font-bold mb-4">
    {String(minutes).padStart(2, "0")}:
    {String(seconds).padStart(2, "0")}
  </div>

  <div className="flex justify-center gap-3">
    <button
      onClick={startTimer}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Start
    </button>

    <button
      onClick={pauseTimer}
      className="bg-yellow-500 text-white px-4 py-2 rounded"
    >
      Pause
    </button>

    <button
      onClick={resetTimer}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Reset
    </button>
  </div>
</div>
        {/* UPCOMING */}
        <div
          className={`p-4 rounded-lg border ${
            darkMode ? "border-gray-800 bg-[#12151b]" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="font-semibold mb-3">Upcoming Exams</h2>

          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-500">No exams added</p>
          ) : (
            upcoming.map((s) => {
              const daysLeft = Math.ceil(
                (new Date(s.examDate) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={s.id}
                  className="flex justify-between py-2 border-b last:border-none"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.examDate}</p>
                  </div>

                  <span className="text-sm text-blue-500 font-medium">
                    {daysLeft < 0 ? "Completed" : `${daysLeft} days left`}
                  </span>
                </div>
              );
            })
          )}
        </div>

        
{/* CALENDAR VIEW */}
<div className={`p-4 rounded shadow mb-6 ${
  darkMode ? "bg-gray-800" : "bg-white"
}`}>

  <div className="flex justify-between items-center mb-3">
    <button
      onClick={() =>
        setCurrentMonth(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        )
      }
    >
      ◀
    </button>

    <h2 className="font-bold">
      {currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}
    </h2>

    <button
      onClick={() =>
        setCurrentMonth(
          new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        )
      }
    >
      ▶
    </button>
  </div>

  <div className="grid grid-cols-7 text-center text-sm font-semibold mb-2">
    <div>Sun</div><div>Mon</div><div>Tue</div>
    <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
  </div>

  <div className="grid grid-cols-7 gap-2">
    {generateCalendarDays().map((day, idx) => {
      const exams = examsOnDate(day);

      return (
        <div
  key={idx}
  className={`h-16 p-1 border rounded text-xs overflow-hidden transition-all ${
    isToday(day)
      ? "bg-pink-300 text-black shadow-lg scale-105 border-yellow-500"
      : darkMode
      ? "border-gray-700"
      : "border-gray-300"
  }`}
>
          <div className="font-bold">{day.getDate()}</div>

          {exams.map((e) => (
            <div
              key={e.id}
              className="bg-blue-500 text-white text-[10px] px-1 rounded mt-1 truncate"
            >
              {e.name}
            </div>
          ))}
        </div>
      );
    })}
  </div>
</div>

        {/* ADD SUBJECT */}
        <div
          className={`p-4 rounded-lg border flex gap-2 ${
            darkMode ? "border-gray-800 bg-[#12151b]" : "bg-white border-gray-200"
          }`}
        >
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject"
            className={`flex-1 p-2 rounded border outline-none ${
              darkMode
                ? "bg-[#0f1115] border-gray-700 text-white"
                : "bg-white border-gray-300"
            }`}
          />

          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className={`p-2 rounded border ${
              darkMode
                ? "bg-[#0f1115] border-gray-700 text-white"
                : "bg-white border-gray-300"
            }`}
          />

          <button
            onClick={addSubject}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>

        {/* SUBJECT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map((s) => {
            const done = s.tasks.filter((t) => t.completed).length;
            const p = s.tasks.length ? Math.round((done / s.tasks.length) * 100) : 0;
            const daysLeft = Math.ceil(
  (new Date(s.examDate) - new Date()) /
    (1000 * 60 * 60 * 24)
);

let borderColor = "";

if (daysLeft < 0) {
  borderColor = "border-green-500"; // Completed
} else if (daysLeft <= 7) {
  borderColor = "border-red-500"; // Exam within 7 days
} else {
  borderColor = "border-blue-500"; // More than 7 days left
}
            return (
              <div
  key={s.id}
  className={`rounded-2xl p-5 border-2 ${borderColor} transition-all hover:-translate-y-1 hover:shadow-xl ${
    darkMode
      ? "bg-[#1a1d24] border-gray-700"
      : "bg-white border-gray-200"
  }`}
>
                <div className="flex justify-between">
                  <h2 className="font-semibold">{s.name}</h2>
                  <button onClick={() => deleteSubject(s.id)}>✕</button>
                </div>

                <p className="text-xs text-gray-500">{s.examDate}</p>
                <div className="flex gap-2 mt-3 mb-3">
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      darkMode
        ? "bg-blue-900/40 text-blue-300"
        : "bg-blue-100 text-blue-600"
    }`}
  >
    {s.tasks.length} Tasks
  </span>

  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      darkMode
        ? "bg-green-900/40 text-green-300"
        : "bg-green-100 text-green-600"
    }`}
  >
    {done} Done
  </span>
</div>

                {/* PROGRESS */}
                <div className="mb-4">
  <div className="flex justify-between text-sm mb-1">
    <span>Progress</span>
    <span>{p}%</span>
  </div>

  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-500 rounded-full transition-all duration-500"
      style={{ width: `${p}%` }}
    />
  </div>
</div>

                {/* TASK INPUT */}
                <div className="flex gap-2 mt-3">
                  <input
                    value={s.newTask || ""}
                    onChange={(e) => updateTaskInput(s.id, e.target.value)}
                    placeholder="Add task"
                    className={`flex-1 p-2 rounded border ${
                      darkMode
                        ? "bg-[#0f1115] border-gray-700 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <button
                    onClick={() => addTask(s.id)}
                    className="px-3 bg-blue-500 text-white rounded"
                  >
                    +
                  </button>
                </div>

                {/* TASK LIST */}
                <div className="mt-3 space-y-2">
                  {s.tasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between text-sm"
                    >
                      <label className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleTask(s.id, t.id)}
                        />
                        <span
                          className={
                            t.completed ? "line-through text-gray-500" : ""
                          }
                        >
                          {t.text}
                        </span>
                      </label>

                      <button onClick={() => deleteTask(s.id, t.id)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default App;