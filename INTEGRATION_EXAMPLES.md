# Frontend-Backend Integration Examples

## Example 1: Resume Upload & Analysis

```jsx
import { useState } from 'react';
import { uploadResume, analyzeResume } from '../services/resumeService';

export function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await uploadResume(formData);
      setUploadedResume(response.data.resume);
      
      // Analyze the resume
      const analysis = await analyzeResume(response.data.resume.id);
      console.log('Analysis:', analysis.data.analysis);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.doc,.docx"
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </form>
  );
}
```

## Example 2: Skill Gap Analysis

```jsx
import { useState } from 'react';
import { analyzeSkillGap, getSkillGapReport } from '../services/skillGapService';

export function SkillGapAnalyzer() {
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzeSkillGap(currentSkills, targetRole);
      setReport(response.data.report);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        placeholder="Current Skills"
        value={currentSkills}
        onChange={(e) => setCurrentSkills(e.target.value)}
      />
      <input
        placeholder="Target Role"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {report && (
        <div>
          <h3>Missing Skills: {report.missingSkills?.join(', ')}</h3>
          <h3>Recommended: {report.recommendedSkills?.join(', ')}</h3>
        </div>
      )}
    </div>
  );
}
```

## Example 3: Roadmap Generation

```jsx
import { useState, useEffect } from 'react';
import { generateRoadmap, getRoadmap, updateRoadmapTask } from '../services/roadmapService';

export function RoadmapBuilder() {
  const [targetRole, setTargetRole] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await generateRoadmap(targetRole);
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskIndex) => {
    try {
      await updateRoadmapTask(taskIndex, true);
      // Refresh roadmap
      const response = await getRoadmap();
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <input
        placeholder="Target Role"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
      />
      <button onClick={handleGenerateRoadmap} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>

      {roadmap?.tasks && (
        <div>
          {roadmap.tasks.map((task, idx) => (
            <div key={idx}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <button onClick={() => handleTaskComplete(idx)}>
                {task.completed ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Example 4: Interview Practice

```jsx
import { useState, useEffect } from 'react';
import { getInterviewQuestions, submitInterview } from '../services/interviewService';

export function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getInterviewQuestions();
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      const response = await submitInterview(
        questions[currentQuestion],
        answer
      );
      setFeedback(response.data.result);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {questions[currentQuestion] && (
        <>
          <h3>{questions[currentQuestion]}</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
          />
          <button onClick={handleSubmitAnswer} disabled={loading}>
            {loading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </>
      )}

      {feedback && (
        <div>
          <p>Feedback: {feedback.feedback}</p>
          <p>Confidence: {feedback.confidenceScore}%</p>
          <p>Communication: {feedback.communicationScore}%</p>
          <p>Overall: {feedback.overallScore}%</p>
        </div>
      )}
    </div>
  );
}
```

## Example 5: AI Assistant Chat

```jsx
import { useState } from 'react';
import { chatWithAI } from '../services/aiService';

export function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    setLoading(true);
    try {
      const response = await chatWithAI(input);
      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}
```

## Example 6: User Profile Management

```jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/profileService';

export function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data.profile);
      setFormData(response.data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateProfile(formData);
      setProfile(response.data.profile);
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      {editing ? (
        <>
          <input
            value={formData.name || ''}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Name"
          />
          <input
            value={formData.targetRole || ''}
            onChange={(e) =>
              setFormData({ ...formData, targetRole: e.target.value })
            }
            placeholder="Target Role"
          />
          <input
            value={formData.college || ''}
            onChange={(e) =>
              setFormData({ ...formData, college: e.target.value })
            }
            placeholder="College"
          />
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </>
      ) : (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Target Role: {profile.targetRole}</p>
          <p>College: {profile.college}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
}
```

## Error Handling Pattern

```jsx
const handleAction = async () => {
  try {
    setError('');
    setLoading(true);
    
    const response = await someService.method();
    // Handle success
    
  } catch (error) {
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

## Notes

- All services automatically include Firebase auth token
- Errors are caught and can be displayed to users
- Loading states should be used for better UX
- Components should check for auth using `useAuth()` hook
