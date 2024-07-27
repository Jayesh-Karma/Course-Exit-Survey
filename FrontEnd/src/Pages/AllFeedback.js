import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllFeedback.css';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
let newRatingsCount = { questionCounts: {} };

const AllFeedback = () => {
    const [allFeedback, setAllFeedback] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [courseOptions, setCourseOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [sessionOptions, setSessionOptions] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjectRatingsCount, setSubjectRatingsCount] = useState({});
    const [selectedSubjectData, setSelectedSubjectData] = useState({
        questionCounts: {},
    });


    const filteredFeedback = allFeedback.filter(
        (feedback) =>
            (selectedCourse ? feedback.selectedCourse === selectedCourse : true) &&
            (selectedBranch ? feedback.selectedBranch === selectedBranch : true) &&
            (selectedSemester ? feedback.selectedSemester === selectedSemester : true) &&
            (selectedSession ? feedback.session === selectedSession : true)
    );

    const resetPage = () => {
        setSelectedSubject('');
        setSubjectRatingsCount({});
        setSelectedSubjectData({ questionCounts: {} });
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                // const response = await axios.get('http://192.168.99.226:5000/get-all-feedback');
                const response = await axios.get('http://localhost:5000/get-all-feedback');
                setAllFeedback(response.data);

                // Extract unique options for dropdowns
                const uniqueCourses = [...new Set(response.data.map((feedback) => feedback.selectedCourse))];
                const uniqueBranches = [...new Set(response.data.map((feedback) => feedback.selectedBranch))];
                const uniqueSemesters = [...new Set(response.data.map((feedback) => feedback.selectedSemester))];
                const uniqueSessions = [...new Set(response.data.map((feedback) => feedback.session))];

                setCourseOptions(uniqueCourses);
                setBranchOptions(uniqueBranches);
                setSemesterOptions(uniqueSemesters);
                setSessionOptions(uniqueSessions);

                // Calculate and set the number of students based on the selected criteria
                const filteredStudents = response.data.filter(
                    (feedback) =>
                        (selectedCourse ? feedback.selectedCourse === selectedCourse : true) &&
                        (selectedBranch ? feedback.selectedBranch === selectedBranch : true) &&
                        (selectedSemester ? feedback.selectedSemester === selectedSemester : true) &&
                        (selectedSession ? feedback.session === selectedSession : true)
                );
                setNumberOfStudents(filteredStudents.length);

                // Calculate ratings counts for each subject and question
                newRatingsCount = {
                    subjectCounts: {},
                    questionCounts: {},
                };


                filteredStudents.forEach((feedback) => {
                    Object.entries(feedback.subjects).forEach(([subject, ratings]) => {
                        if (!newRatingsCount.subjectCounts[subject]) {
                            newRatingsCount.subjectCounts[subject] = {};
                        }

                        if (!newRatingsCount.questionCounts[subject]) {
                            newRatingsCount.questionCounts[subject] = {};
                        }

                        Object.entries(ratings).forEach(([question, rating]) => {
                            // Count for each rating for each subject
                            if (!newRatingsCount.subjectCounts[subject][rating]) {
                                newRatingsCount.subjectCounts[subject][rating] = 1;
                            } else {
                                newRatingsCount.subjectCounts[subject][rating]++;
                            }

                            // Count for each rating for each question
                            if (!newRatingsCount.questionCounts[subject][question]) {
                                newRatingsCount.questionCounts[subject][question] = {};
                            }

                            if (!newRatingsCount.questionCounts[subject][question][rating]) {
                                newRatingsCount.questionCounts[subject][question][rating] = 1;
                            } else {
                                newRatingsCount.questionCounts[subject][question][rating]++;
                            }
                        });
                    });
                });

                setSubjectRatingsCount(newRatingsCount);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchData();

        return () => {
            resetPage();
        };

    }, [selectedCourse, selectedBranch, selectedSemester, selectedSession]);


    const calculateAverageRating = (ratings) => {
        const ratingValues = Object.values(ratings).map(Number);
        const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
        const average = sum / ratingValues.length;
        return isNaN(average) ? 'N/A' : average.toFixed(2);
    };

    const calculateSubjectQuestionAverage = (subject, questionIndex) => {
        const questionRatings = filteredFeedback.map((feedback) =>
            feedback.subjects[subject] ? feedback.subjects[subject][questionIndex] : null
        );
        return calculateAverageRating(questionRatings);
    };

    const subjectColumns = Array.from(new Set(filteredFeedback.flatMap((feedback) => Object.keys(feedback.subjects))));

    const overallAverages = subjectColumns.map((subject) => ({
        subject,
        averages: Array.from({ length: 9 }, (_, questionIndex) => calculateSubjectQuestionAverage(subject, questionIndex)),
    }));

    // console.log(overallAverages)

    useEffect(() => {
        // Calculate ratings counts for the selected subject
        const newSubjectRatingsCount = {
            questionCounts: {},
        };
        const newSubjectData = [];


        // Filter feedback data based on the selected subject, session, and course
        const filteredFeedbackForSubject = allFeedback.filter(
            (feedback) =>
                selectedSubject &&
                feedback.subjects[selectedSubject] &&
                feedback.session === selectedSession &&
                feedback.selectedCourse === selectedCourse &&
                feedback.selectedSemester === selectedSemester
        );

        // Calculate ratings counts for each question
        filteredFeedbackForSubject.forEach((feedback) => {
            if (feedback.subjects[selectedSubject]) {
                Object.entries(feedback.subjects[selectedSubject]).forEach(([question, rating]) => {
                    if (!newSubjectRatingsCount.questionCounts[question]) {
                        newSubjectRatingsCount.questionCounts[question] = {};
                    }

                    if (!newSubjectRatingsCount.questionCounts[question][rating]) {
                        newSubjectRatingsCount.questionCounts[question][rating] = 1;
                    } else {
                        newSubjectRatingsCount.questionCounts[question][rating]++;
                    }
                });
            }
        });

        setSubjectRatingsCount(newSubjectRatingsCount);


        const questionCount = 8; // Assuming there are 10 questions
        for (let i = 0; i <= questionCount; i++) {
            const questionRatings = filteredFeedbackForSubject.map((feedback) =>
                feedback.subjects[selectedSubject] ? feedback.subjects[selectedSubject][i.toString()] : null
            );

            const averageRating = calculateAverageRating(questionRatings);
            newSubjectData.push({
                question: `Question ${i + 1}`,
                averageRating: isNaN(averageRating) ? 0 : parseFloat(averageRating),
            });

        }

        setSelectedSubjectData(newSubjectData);
    }, [selectedSubject, allFeedback, selectedSession, selectedCourse, selectedSemester]);


    return (
        <>
            <div className="feedback-container" >
                <div className='nav-2'>
                    <div className='clglogo-2'>
                        <img src="/images/SVCE%20Logo.jpg" alt="" />
                    </div>
                    <div className='c-name-2'>
                        <div>
                            <h2>Swami Vivekanand Groups of Institutions</h2>
                            <p>Engineering | Pharmacy | Management | Diploma</p>
                        </div>
                    </div>

                </div>
                <h2 className="head">
                    <Link to="/">Course Exit Survey Result</Link>
                </h2>
                <div className="selectiondiv">
                    <div className='ss-1'>
                        <div>
                            <label>Select Course :</label>
                            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                                <option value="">All Courses</option>
                                {courseOptions.map((course) => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Select Session :</label>
                            <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                                <option value="">All Sessions</option>
                                {sessionOptions.map((session) => (
                                    <option key={session} value={session}>
                                        {session}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='ss-1'>
                        <div>
                            <label>Select Branch :</label>
                            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                                <option value="">All Branches</option>
                                {branchOptions.map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Select Semester :</label>
                            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                                <option value="">All Semesters</option>
                                {semesterOptions.map((semester) => (
                                    <option key={semester} value={semester}>
                                        {semester}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                </div>

                {filteredFeedback.length > 0 && selectedSession && selectedSemester && selectedBranch && selectedCourse &&(
                    <>
                        <div className="totalstu">
                            <p>
                                Number of Students Given Feedback: <span>{numberOfStudents}</span>
                            </p>
                        </div>

                        <div className="overall">
                            <h4>Overall Average Table Out Of 5</h4>
                            <div className="o-tab">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Question 1</th>
                                        <th>Question 2</th>
                                        <th>Question 3</th>
                                        <th>Question 4</th>
                                        <th>Question 5</th>
                                        <th>Question 6</th>
                                        <th>Question 7</th>
                                        <th>Question 8</th>
                                        <th>Question 9</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {overallAverages.map(({ subject, averages }, subjectIndex) => (
                                        <tr key={subjectIndex}>
                                            <td>{subject}</td>
                                            {averages.map((average, questionIndex) => (
                                                <td key={questionIndex}>{average}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="selectiondiv-1">
                            <div className='s-1-s'>
                                <h4>Subject-wise Ratings Count</h4>
                                <label>Select Subject:</label>
                                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                    <option value="">Select Subject</option>
                                    {subjectColumns.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="o-tab">
                                {selectedSubject && (
                                    <div>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Question</th>
                                                <th>Rating 1</th>
                                                <th>Rating 2</th>
                                                <th>Rating 3</th>
                                                <th>Rating 4</th>
                                                <th>Rating 5</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Object.entries(subjectRatingsCount.questionCounts).map(([question, ratings]) => {
                                                const ratingsArray = Object.entries(ratings).map(([rating, count]) => ({ rating, count }));
                                                ratingsArray.sort((a, b) => b.count - a.count); // Sort by count in descending order

                                                return (
                                                    <tr key={question}>
                                                        <td>{`Question ${Number(question) + 1}`}</td>
                                                        {['1', '2', '3', '4', '5'].map((rating) => (
                                                            <td key={rating}>{ratings[rating] || 0}</td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}

                                            </tbody>
                                        </table>
                                        <div className="bar-chart">
                                            {/* <h4>Bar Chart for {selectedSubject}</h4> */}
                                            <ReactApexChart
                                                options={{
                                                    chart: {
                                                        type: 'bar',
                                                        stacked: true,
                                                        // stackType: "100%"
                                                    },
                                                    plotOptions: {
                                                        bar: {
                                                            horizontal: false,
                                                            columnWidth: '45%',
                                                            distributed: true,
                                                        },
                                                    },
                                                    dataLabels: {
                                                        enabled: true,
                                                        formatter: function (val) {
                                                            return (val * 20).toFixed(2) + '%';
                                                        },
                                                    },
                                                    xaxis: {
                                                        categories: selectedSubjectData.map((item) => item.question),
                                                    },
                                                    yaxis: {
                                                        title: {
                                                            text: 'Percentage',
                                                        },
                                                        max: '100%',
                                                        labels: {
                                                            formatter: function (val) {
                                                                return (val).toFixed(2) * 20;
                                                            },
                                                        },
                                                    },
                                                    title: {
                                                        text: 'Bar Chart for ' + selectedSubject,
                                                        align: 'center',
                                                        style: {
                                                            fontSize: '16px',
                                                        },
                                                    }
                                                }}
                                                series={[
                                                    {
                                                        name: 'Percentage',
                                                        data: selectedSubjectData.map((item) => item.averageRating),
                                                    },
                                                ]}
                                                type="bar"
                                                height={'400vh'}
                                                width={'100%'}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AllFeedback;