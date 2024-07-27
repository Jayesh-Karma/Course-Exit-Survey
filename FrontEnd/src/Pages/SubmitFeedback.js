import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import './Submit.css'


const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        course: '',
        branch: '',
        session: '',
        semester: '',
        subjects: {},
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const resetPage = () => {
        setFormData((prevData) => ({
            ...prevData,
            subjects: {},
        }));
    };


    const handleCourseChange = (selectedCourse) => {
        setFormData((prevData) => ({
            ...prevData,
            course: selectedCourse,
            branch: '',
            semester: '',
            subjects: {},
        }));
    };

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            branch: '',
            semester: '',
            session: '',
            subjects: {},
        }));

    }, [formData.course]);

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            subjects: {},
        }));

        return(resetPage())

    }, [formData.semester]);

    const handleSubjectRatingChange = (subject, question, rating) => {
        setFormData((prevData) => ({
            ...prevData,
            subjects: {
                ...prevData.subjects,
                [subject]: {
                    ...prevData.subjects[subject],
                    [question]: rating,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            (formData.rollNo && formData.rollNo.length !== 12) ||
            !formData.course ||
            !formData.branch ||
            !formData.session ||
            !formData.semester ||
            getQuestions().some((question) =>
                getSubjectsForFeedback(formData.course, formData.branch, formData.semester).some(
                    (subject) => !formData.subjects[subject]?.[question]
                )
            )
        ) {
            if (formData.rollNo && formData.rollNo.length !== 12) {
                alert('Enrollment number should be exactly 12 characters.');
            } else {
                alert('Please fill in all the required fields and provide feedback for all subjects.');
            }
            return;
        }

        try {
            // const response = await axios.post('http://192.168.99.226:5000/submit-feedback', formData);
            const response = await axios.post('http://localhost:5000/submit-feedback', formData);

            const handleClearForm = () => {
                setFormData({
                    name: '',
                    rollNo: '',
                    course: '',
                    branch: '',
                    session: '',
                    semester: '',
                    subjects: {},
                });
            };

            if (response.data.error) {
                alert('Error: Enrollment number has already been used.');
            } else {
                alert('Feedback Submitted successfully!');
                handleClearForm();
            }
        } catch (error) {
            console.error('Error in submitting feedback:', error);
        }
    };

    const getFilteredSubjects = () => {
        if (formData.course && formData.branch && formData.semester) {
            return getSubjectsForFeedback(formData.course, formData.branch, formData.semester);
        }
        return [];
    };

    const handleBranchChange = (selectedBranch) => {
        setFormData((prevData) => ({
            ...prevData,
            branch: selectedBranch,
            semester: '',
            subjects: {},
        }));
    };



    return (
        <>
            <div className='nav'>
                <div className='clglogo'>
                    <img src="/images/SVCE%20Logo.jpg" alt=""/>
                </div>
                <div className='c-name'>
                    <h2>Swami Vivekanand Groups of Institutions</h2>
                    <p>Engineering | Pharmacy | Management | Diploma</p>
                </div>
                    <Link to="/login"><div className={'feedback-link'}>ADMIN</div></Link>
            </div>

            <h1 className='mainHead'>Course Exit Survey</h1>
            <div className='mdiv'>
                <div>

                    <div className='upper'>
                        <div className='first'>
                            <h3>(Enter your details carefully)</h3>

                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Enrollment No:</label>
                            <input
                                type="text"
                                name="rollNo"
                                value={formData.rollNo}
                                onChange={handleInputChange}
                                required
                            />

                            <label>Course:</label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={(e) => handleCourseChange(e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech/ME">M.Tech/ME</option>
                                <option value="MBA">MBA</option>

                            </select>

                            <label>Branch:</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={(e) => handleBranchChange(e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                {formData.course === 'B.Tech' && (
                                    <>
                                        <option value="CS">Computer Science and Engineering</option>
                                        <option value="ECE">Electronics and Communication Engineering</option>
                                        <option value="IT">Information Technology</option>
                                        <option value="ME">Mechenical Engineering</option>
                                        <option value="CE">Civil Engineering</option>
                                        <option value="EX">Electrical and Electronics </option>
                                    </>
                                )}



                                {formData.course === 'M.Tech/ME' && (
                                    <>
                                        <option value="MCSE">Computer Science and Engineering</option>
                                        <option value="PowerSystems">PowerSystems</option>
                                        <option value="VLSI">VLSI</option>
                                        <option value="MD">MD</option>
                                    </>
                                )}

                                {formData.course === 'MBA' && (
                                    <>
                                        <option value="1-year">1st Year</option>
                                        <option value="Marketing/Finance">Marketing/Finance</option>
                                        <option value="Marketing/HR">Marketing/HR</option>
                                        <option value="Marketing/IT">Marketing/IT</option>
                                        <option value="Finance/IT">Finance/IT</option>
                                        <option value="Finance/HR">Finance/HR</option>
                                        <option value="HR/IT">HR/IT</option>
                                        <option value="HR/Production&Operation">HR/Production & Operation</option>
                                        <option value="Marketing/Production&Operation">Marketing/Production & Operation</option>
                                        <option value="Finance/Production&Operation">Finance/Production & Operation</option>
                                        <option value="IT/Production&Operation">IT/Production & Operation</option>
                                    </>
                                )}
                            </select>

                            <label>Session:</label>
                            <select
                                name="session"
                                value={formData.session}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select...</option>
                                {formData.course && formData.branch && (
                                    <>
                                <option value="2018-19">2018-19</option>
                                <option value="2019-20">2019-20</option>
                                <option value="2020-21">2020-21</option>
                                <option value="2021-22">2021-22</option>
                                <option value="2022-23">2022-23</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2026-27">2026-27</option>
                                <option value="2027-28">2027-28</option>
                                <option value="2028-29">2028-29</option>
                                <option value="2029-30">2029-30</option>
                                <option value="2030-31">2030-31</option>
                                <option value="2031-32">2031-32</option>
                                <option value="2032-33">2032-33</option>
                                <option value="2033-34">2033-34</option>
                                <option value="2034-35">2034-35</option>
                                <option value="2035-36">2035-36</option>
                                <option value="2036-37">2036-37</option>
                                <option value="2037-38">2037-38</option>
                                <option value="2038-39">2038-39</option>
                                <option value="2039-40">2039-40</option>
                                    </> )}
                            </select>
                        </div>
                        <div className='u-pic'>
                            <img src='/images/5211204.jpg' alt=''/>
                        </div>

                    </div>
                    <div className='botom'>

                        <div className='b-left'>

                            <h2 className='tableHead'>Questions</h2>
                            <ul>
                                <li className='firstLi'>Course Outcomes were clearly identified</li>
                                <li>Relevance of the textbook to this course </li>
                                <li>Were the lecture/lab well organized and presented at a reasonable pace</li>
                                <li>Did the problem worked out in the classroom/Online class help you to understand how to solve question on your own</li>
                                <li>Are the assignment/lab experiment procedure clearly explained</li>
                                <li>The learning resourse in the course help you to achive the course outcomes (Lecture notes,PPTs,Online meterial etc.)</li>
                                <li>The Quality of teaching in the course help you to achive the course outcomes</li>
                                <li>Are you motivated to achive the course outcomes.(Having the desire or drive to learn, to complete task and to willing strive for goals)</li>
                                <li>Your overall satisfaction about the course</li>
                            </ul>
                        </div>

                        <div className='b-right'>
                            <div className='sem'>

                                <div><label className='tableHead semester'>Semester:</label></div>

                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select...</option>
                                    {formData.course === 'B.Tech' && (
                                        <>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>8</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === '1-year' && (
                                        <>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Marketing/Finance'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Marketing/HR'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}

                                    {formData.course === 'MBA' && formData.branch ===  'Marketing/IT'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Finance/IT'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Finance/HR'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'HR/IT'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'HR/Production&Operation'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Marketing/Production&Operation'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'Finance/Production&Operation'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}
                                    {formData.course === 'MBA' && formData.branch === 'IT/Production&Operation'&&(
                                        <>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}

                                    {formData.course === 'M.Tech/ME' && (
                                        <>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                        </>
                                    )}

                                </select>
                            </div>
                            <div className='tab'>
                                {formData.course && formData.branch && formData.semester && (
                                    <>
                                        <table>
                                            <thead>
                                            <tr>
                                                {getFilteredSubjects().map((subject) => (
                                                    <th key={subject}>{subject}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {getQuestions().map((question) => (
                                                <tr key={question}>
                                                    {getFilteredSubjects().map((subject) => (
                                                        <td key={subject}>
                                                            <select
                                                                className='tableSelection'
                                                                value={formData.subjects[subject]?.[question] || ''}
                                                                onChange={(e) =>
                                                                    handleSubjectRatingChange(subject, question, e.target.value)
                                                                }
                                                                required
                                                            >
                                                                <option value="">--Rate--</option>
                                                                <option value="5">5 (Excellent)</option>
                                                                <option value="4">4 (Very Good)</option>
                                                                <option value="3">3 (Good)</option>
                                                                <option value="2">2 (Fair)</option>
                                                                <option value="1">1 (Poor)</option>
                                                            </select>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
                <div className='btn'>
                    <button type="submit"
                            onClick={handleSubmit}>Submit Feedback
                    </button>
                </div>

            </div>
            <footer>
                <div><h4>All rights reserved &copy; by SVCE</h4></div>
                <div className="names">
                    <h2>Designed and Developed by</h2>
                    <div className='ourNames'>
                        <h5>Anurag Solanki </h5>
                        <h5>Abhishek Mishra</h5>
                        <h5> Jayesh karma</h5>
                    </div>
                </div>
            </footer>

        </>
    );
};

const getSubjectsForFeedback = (course, branch, semester) => {
    const subjectsMapping = {
        'B.Tech': {
            'CS': {
                1: ['BT-101', 'BT-102', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                2: ['BT-201', 'BT-202', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                3: ['ES-301', 'CS-302', 'CS-303', 'CS-304', 'CS-305','CS-306(P)'],
                4: ['BT-401', 'CS-402', 'CS-403', 'CS-404', 'CS-405','CS-406(P)'],
                5: ['CS-501', 'CS-502', 'CS-503', 'CS-504','CS-505(P)','CS-506(P)'],
                6: ['CS-601', 'CS-602', 'CS-603', 'CS-604','CS-605(P)','CS-606(P)'],
                7: ['CS-701', 'CS-702', 'CS-703','CS-704(P)','CS-705(P)'],
                8: ['CS-801', 'CS-802', 'CS-803','CS-804(P)'],

                // Add subjects for other semesters
                // ...
            },
            'IT':{
                1: ['BT-101', 'BT-102', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                2: ['BT-201', 'BT-202', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                3:['ES-301', 'IT-302', 'IT-303', 'IT-304', 'IT-305','IT-306(P)'],
                4:['BT-401', 'IT-402', 'IT-403', 'IT-404', 'IT-405', 'IT-406(P)', 'IT-407(P)'],
                5:['IT-501', 'IT-502', 'IT-503', 'IT-504', 'IT-505(P)', 'IT-506(P)'],
                6:['IT-601', 'IT-602', 'IT-603', 'IT-604','IT-605(P)','IT-606(P)'],
                7:['IT-701', 'IT-702', 'IT-703', 'IT-704(P)', 'IT-705(P)'],
                8:['IT-801', 'IT-802','IT-803', 'IT-804(P)'],
            },
            'ECE': {
                1: ['BT-201', 'BT-102', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                2: ['BT-101', 'BT-202', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                3: ['BT-301', 'EC-302', 'EC-303', 'EC-304', 'EC-305','EC-306(P)'],
                4: ['ES-401', 'EC-402', 'EC-403', 'EC-404', 'EC-405','EC-406(P)'],
                5: ['EC-501', 'EC-502', 'EC-503', 'EC-504','EC-505(P)','EC-506(P)'],
                6: ['EC-601', 'EC-602', 'EC-603', 'EC-604','EC-605(P)','EC-606(P)'],
                7: ['EC-701', 'EC-702', 'EC-703','EC-704(P)','EC-705(P)'],
                8: ['EC-801', 'EC-802', 'EC-803','EC-804(P)'],
                // Add subjects for other semesters
                // ...
            },
            'CE': {
                1: ['BT-201', 'BT-102', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                2: ['BT-101', 'BT-202', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                3: ['BT-301', 'CE-302', 'CE-303', 'CE-304', 'CE-305', 'CE-306(P)'],
                4: ['ES-401', 'CE-402', 'CE-403', 'CE-404', 'CE-405','CE-406(P)'],
                5: ['CE-501', 'CE-502', 'CE-503', 'CE-504','CE-505(P)','CE-506(P)'],
                6: ['CE-601', 'CE-602', 'CE-603', 'CE-604','CE-605(P)','CE-606(P)'],
                7: ['CE-701', 'CE-702', 'CE-703','CE-704(P)','CE-705(P)'],
                8: ['CE-801', 'CE-802', 'CE-803','CE-804(P)'],
                // Add subjects for other semesters
                // ...
            },
            'ME': {
                1: ['BT-201', 'BT-102', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                2: ['BT-101', 'BT-202', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                3: ['BT-301', 'ME-302', 'ME-303', 'ME-304', 'ME-305','ME-306(P)'],
                4: ['ES-401', 'ME-402', 'ME-403', 'ME-404', 'ME-405','ME-406(P)'],
                5: ['ME-501', 'ME-502', 'ME-503', 'ME-504','ME-505(P)','ME-506(P)'],
                6: ['ME-601', 'ME-602', 'ME-603', 'ME-604','ME-605(P)','ME-606(P)'],
                7: ['ME-701', 'ME-702', 'ME-703','ME-704(P)','ME-705(P)'],
                8: ['ME-801', 'ME-802', 'ME-803','ME-804(P)'],
                // Add subjects for other semesters
                // ...
            },
            'EX': {
                1: ['BT-101', 'BT-102', 'BT-103', 'BT-104', 'BT-105','BT-106(P)'],
                2: ['BT-201', 'BT-202', 'BT-203', 'BT-204', 'BT-205','BT-206(P)'],
                3: ['ES-301', 'EX-302', 'EX-303', 'EX-304', 'EX-305','EX-306(P)'],
                4: ['BT-401', 'EX-402', 'EX-403', 'EX-404', 'EX-405', 'EX-406(P)'],
                5: ['EX-501', 'EX-502', 'EX-503', 'EX-504', 'EX-505(P)', 'EX-506(P)'],
                6: ['EX-601', 'EX-602', 'EX-603', 'EX-604','EX-605(P)','EX-606(P)'],
                7: ['EX-701', 'EX-702', 'EX-703','EX-704(P)','EX-705(P)'],
                8: ['EX-801', 'EX-802', 'EX-803', 'EX-804(P)'],
                // Add subjects for other semesters
                // ...
            },
            // Add other branches...
        },
        'MBA': {
            '1-year': {
                1: ['FT101C' ,'FT102C' ,'FT103C' ,'FT1' ,'FT105C' ,'FT106C' ,'FT107C' ,'FT108C'],
                2: ['FT201C' ,'FT202C' ,'FT203C' ,'FT204C' ,'FT205C' ,'FT206C' ,'FT207C' ,'FT208C' ]
                // Add subjects for other semesters
                // ...
            },
            'Marketing/Finance': {
                3: ['FT301C' , 'FT302C' ,'FT303M','FT304M','FT305M','FT303F','FT304F','FT305F'],
                4: ['FT401C' , 'FT402C' ,'FT403M','FT404M','FT405M','FT403F','FT404F','FT405F']
            },
            'Marketing/HR': {
                3: ['FT301C' , 'FT302C' ,'FT303M','FT304M','FT305M','FT303H','FT304H','FT305H'],
                4: ['FT401C' , 'FT402C' ,'FT403M','FT404M','FT405M','FT403H','FT404H','FT405H']
            },
            'Marketing/IT': {
                3: ['FT301C' , 'FT302C' ,'FT303M','FT304M','FT305M','FT303I','FT304I','FT305I'],
                4: ['FT401C' , 'FT402C' ,'FT403M','FT404M','FT405M','FT403I','FT404I','FT405I']
            },

            'Finance/IT':{
                3: ['FT301C' , 'FT302C' ,'FT303F','FT304F','FT305F','FT303I','FT304I','FT305I'],
                4: ['FT401C' , 'FT402C' ,'FT403F','FT404F','FT405F','FT403I','FT404I','FT405I']
            },
            'Finance/HR':{
                3: ['FT301C' , 'FT302C' ,'FT303F','FT304F','FT305F' ,'FT303H','FT304H','FT305H'],
                4: ['FT401C' , 'FT402C' ,'FT403F','FT404F','FT405F','FT403H','FT404H','FT405H']
            },
            'HR/IT':{
                3: ['FT301C' , 'FT302C' ,'FT303H','FT304H','FT305H','FT303I','FT304I','FT305I'],
                4: ['FT401C' , 'FT402C' ,'FT403H','FT404H','FT405H','FT403I','FT404I','FT405I'],
            },
            'HR/Production&Operation':{
                3: ['FT301C' , 'FT302C' ,'FT303H','FT304H','FT305H','FT303P','FT304P','FT305P'],
                4: ['FT401C' , 'FT402C' ,'FT403H','FT404H','FT405H','FT403P','FT404P','FT405P'],
            },
            'Marketing/Production&Operation': {
                3: ['FT301C' , 'FT302C' ,'FT303M','FT304M','FT305M','FT303P','FT304P','FT305P'],
                4: ['FT401C' , 'FT402C' ,'FT403M','FT404M','FT405M','FT403P','FT404P','FT405P']
            },
            'Finance/Production&Operation':{
                3: ['FT301C' , 'FT302C' ,'FT303F','FT304F','FT305F' ,'FT303P','FT304P','FT305P'],
                4: ['FT401C' , 'FT402C' ,'FT403F','FT404F','FT405F','FT403P','FT404P','FT405P']
            },
            'IT/Production&Operation':{
                3: ['FT301C' , 'FT302C' ,'FT303P','FT304P','FT305P','FT303I','FT304I','FT305I'],
                4: ['FT401C' , 'FT402C' ,'FT403P','FT404P','FT405P','FT403I','FT404I','FT405I'],
            },

            // Add other branches...
        },
        'M.Tech/ME': {
            'MCSE': {
                1: ['MCSE101', 'MCSE102', 'MCSE103', 'MCSE104', 'MCSE105','MCSE106(P)','MCSE107(P)'],
                2:['MCSE201', 'MCSE202', 'MCSE203', 'MCSE204', 'MCSE205','MCSE206(P)','MCSE207(P)'],
                3:['MCSE301', 'MCSE302','MCSE303(P)','MCSE304(P)'],
                4:['MCSE401']
                // Add subjects for other semesters
                // ...
            },
            'PowerSystems':{
                1:['MEPS101', 'MEPS102', 'MEPS103', 'MEPS104', 'MEPS105','MEPS106(P)','MEPS107(P)'],
                2:['MEPS201', 'MEPS202', 'MEPS203', 'MEPS204', 'MEPS205','MEPS206(P)','MEPS207(P)'],
                3:['MEPS301', 'MEPS302','MEPS304(P)'],
                4:['MEPS401']
            },
            'VLSI':{
                1: ['MEVD-101', 'MEVD-102', 'MEVD-103', ' MEVD-104', 'MEVD-105','MEVD-106(P)','MEVD-107(P)'],
                2: ['MEVD-201', 'MEVD-202', 'MEVD-203', ' MEVD-204', 'MEVD-205','MEVD-206(P)','MEVD-207(P)'],
                3: ['MEVD-301', 'MEVD-302','MEVD-303(P)','MEVD-304(P)'],
                4: ['MEVD-401'],
            },
            'MD':{
                1:['MMPD101', 'MMPD102','MMPD103','MMPD104','MMPD105','MMPD106(P)','MMPD107(P)'],
                2:['MMPD201', 'MMPD202','MMPD203','MMPD204' ,'MMPD205','MMPD206(P)','MMPD207(P)'],
                3:['MMPD301','MMPD302','MMPD303(P)','MMPD304(P)'],
                4:['MMPD401']},
            // Add other branches...
        }
        // Add other courses...
    }

    const subjects = subjectsMapping[course]?.[branch]?.[semester] || [];

    return subjects;
};


const getQuestions = () => [...Array(9).keys()];

export default App;
