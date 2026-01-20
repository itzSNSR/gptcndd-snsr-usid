/**
 * USDI - Data Management Layer
 * Handles mock data and localStorage persistence
 */

const USDI_DATA = {
    STORAGE_KEY: 'usdi_students',
    INSTITUTION_KEY: 'usdi_institution',

    // Default institution data
    defaultInstitution: {
        id: 'INST001',
        name: 'National Institute of Technology',
        code: 'NIT',
        adminUser: 'admin',
        adminPass: 'admin123'
    },

    // Mock student data
    defaultStudents: [
        {
            usn: 'USDI2024001',
            fullName: 'Rahul Sharma',
            dob: '2002-05-15',
            mobile: '9876543210',
            institution: 'National Institute of Technology',
            course: 'B.Tech Computer Science',
            semesterYear: '6th Semester',
            status: 'Active',
            photo: null,
            createdAt: '2021-08-01',
            academicHistory: [
                { date: '2024-08-01', event: 'Enrolled in 6th Semester', type: 'enrollment' },
                { date: '2024-01-15', event: 'Completed 5th Semester with 8.5 CGPA', type: 'completion' },
                { date: '2023-08-01', event: 'Enrolled in 5th Semester', type: 'enrollment' },
                { date: '2023-01-10', event: 'Completed 4th Semester with 8.2 CGPA', type: 'completion' },
                { date: '2021-08-01', event: 'Admitted to B.Tech Computer Science', type: 'admission' }
            ]
        },
        {
            usn: 'USDI2024002',
            fullName: 'Priya Patel',
            dob: '2001-11-22',
            mobile: '9876543211',
            institution: 'National Institute of Technology',
            course: 'B.Tech Electronics',
            semesterYear: '8th Semester',
            status: 'Active',
            photo: null,
            createdAt: '2020-08-01',
            academicHistory: [
                { date: '2024-08-01', event: 'Enrolled in 8th Semester', type: 'enrollment' },
                { date: '2024-01-15', event: 'Completed 7th Semester with 9.1 CGPA', type: 'completion' },
                { date: '2020-08-01', event: 'Admitted to B.Tech Electronics', type: 'admission' }
            ]
        },
        {
            usn: 'USDI2023015',
            fullName: 'Amit Kumar',
            dob: '2000-03-10',
            mobile: '9876543212',
            institution: 'National Institute of Technology',
            course: 'B.Tech Mechanical',
            semesterYear: 'Completed',
            status: 'Graduated',
            photo: null,
            createdAt: '2019-08-01',
            academicHistory: [
                { date: '2023-06-15', event: 'Graduated with First Class Distinction', type: 'graduation' },
                { date: '2023-05-01', event: 'Completed Final Semester', type: 'completion' },
                { date: '2019-08-01', event: 'Admitted to B.Tech Mechanical', type: 'admission' }
            ]
        },
        {
            usn: 'USDI2024003',
            fullName: 'Sneha Reddy',
            dob: '2002-08-05',
            mobile: '9876543213',
            institution: 'National Institute of Technology',
            course: 'B.Tech Civil',
            semesterYear: '4th Semester',
            status: 'Transferred',
            photo: null,
            createdAt: '2022-08-01',
            academicHistory: [
                { date: '2024-02-01', event: 'Transferred to ABC Engineering College', type: 'transfer' },
                { date: '2023-08-01', event: 'Enrolled in 3rd Semester', type: 'enrollment' },
                { date: '2022-08-01', event: 'Admitted to B.Tech Civil', type: 'admission' }
            ]
        },
        {
            usn: 'USDI2022010',
            fullName: 'Vikram Singh',
            dob: '2001-01-20',
            mobile: '9876543214',
            institution: 'National Institute of Technology',
            course: 'B.Tech Computer Science',
            semesterYear: '3rd Semester',
            status: 'Discontinued',
            photo: null,
            createdAt: '2022-08-01',
            academicHistory: [
                { date: '2023-12-01', event: 'Discontinued due to personal reasons', type: 'discontinue' },
                { date: '2023-08-01', event: 'Enrolled in 3rd Semester', type: 'enrollment' },
                { date: '2022-08-01', event: 'Admitted to B.Tech Computer Science', type: 'admission' }
            ]
        },
        {
            usn: 'USDI2024004',
            fullName: 'Ananya Gupta',
            dob: '2003-02-14',
            mobile: '9876543215',
            institution: 'National Institute of Technology',
            course: 'B.Tech Information Technology',
            semesterYear: '2nd Semester',
            status: 'Active',
            photo: null,
            createdAt: '2024-08-01',
            academicHistory: [
                { date: '2025-01-10', event: 'Enrolled in 2nd Semester', type: 'enrollment' },
                { date: '2024-12-15', event: 'Completed 1st Semester with 8.8 CGPA', type: 'completion' },
                { date: '2024-08-01', event: 'Admitted to B.Tech Information Technology', type: 'admission' }
            ]
        },
        {
            // SECTION 1: PERSONAL DETAILS
            usn: 'USIDSN082006',
            fullName: 'Sabarinadh S R',
            dob: '2006-08-31',
            dobFormatted: '31 August 2006',
            gender: 'Male',
            mobile: '8590082365',
            otp: '082006',
            email: 'sabarinadh.sr@example.com',
            nationality: 'Indian',
            state: 'Kerala',
            district: 'Thiruvananthapuram',
            studentCategory: 'General',
            category: 'General',

            // SECTION 2: CURRENT INSTITUTION
            institution: 'Government Polytechnic College, Nedumangad',
            institutionShortName: 'GPTC Nedumangad',
            institutionType: 'Government Polytechnic',
            affiliatedAuthority: 'Directorate of Technical Education, Kerala',
            course: 'Diploma in Computer Engineering',
            branchCode: 'DC',
            modeOfStudy: 'Regular',
            admissionType: 'Merit',
            admissionYear: 2023,
            expectedCompletionYear: 2026,
            semesterYear: 'Semester 4',
            status: 'Active',
            batch: '2023–2026',

            // SECTION 3: INSTITUTION IDENTIFIERS
            institutionIdentifiers: {
                collegeAdmissionNumber: 'GPTCNDM-DC-2023-041',
                polytechnicRegisterNumber: 'DTE-KL-DC-2023-11892',
                examRegistrationNumber: 'DTE-EXAM-DC-2023-56741',
                rollNumber: 'DC-04-23'
            },

            // SECTION 4: ACADEMIC HISTORY (Table Format)
            academicHistoryTable: [
                {
                    qualification: 'SSLC',
                    institution: 'School Education',
                    board: 'Kerala State Board',
                    year: '2022',
                    status: 'Completed'
                },
                {
                    qualification: 'Higher Secondary (Plus Two)',
                    institution: 'Higher Secondary School',
                    board: 'Kerala Higher Secondary Board',
                    year: '2024',
                    status: 'Completed'
                },
                {
                    qualification: 'Diploma in Computer Engineering',
                    institution: 'Government Polytechnic College, Nedumangad',
                    board: 'DTE Kerala',
                    year: '2023-2026',
                    status: 'Ongoing'
                }
            ],

            // SECTION 5: CURRENT COURSE DETAILS
            currentCourse: {
                name: 'Diploma in Computer Engineering',
                institution: 'Government Polytechnic College, Nedumangad',
                admissionYear: 2023,
                expectedCompletionYear: 2026,
                currentSemester: 'Semester 4',
                courseStatus: 'Ongoing'
            },

            // SECTION 6: USDI VERIFICATION DETAILS
            verification: {
                accountStatus: 'Verified',
                methods: ['OTP Verification', 'QR Code Verification'],
                qrCodeStatus: 'Active',
                lastUpdatedBy: 'Institution Admin',
                lastUpdatedDate: '15 January 2026'
            },

            // SECTION 7: EXTRA GOVERNMENT-LEVEL FIELDS
            governmentFields: {
                identityType: 'Digital Student ID',
                recordAuthority: 'Unified Student Digital ID System (USDI)',
                dataSource: 'Institution Verified',
                dataUsage: 'Verification and Academic Identity Only'
            },

            // Legacy fields for compatibility
            photo: null,
            createdAt: '2023-08-01',
            verificationStatus: 'Verified',
            qrCodeStatus: 'Active',
            lastUpdated: '2026-01-15',

            // Timeline-style academic history for existing UI
            academicHistory: [
                { date: '2026-01-15', event: 'Enrolled in Semester 4', type: 'enrollment' },
                { date: '2025-06-15', event: 'Completed Semester 3', type: 'completion' },
                { date: '2025-01-10', event: 'Enrolled in Semester 3', type: 'enrollment' },
                { date: '2024-06-15', event: 'Completed Semester 2', type: 'completion' },
                { date: '2024-01-10', event: 'Enrolled in Semester 2', type: 'enrollment' },
                { date: '2023-12-15', event: 'Completed Semester 1', type: 'completion' },
                { date: '2023-08-01', event: 'Admitted to Diploma in Computer Engineering', type: 'admission' },
                { date: '2024', event: 'Completed Higher Secondary (Plus Two) - Kerala HSE Board', type: 'education' },
                { date: '2022', event: 'Completed SSLC - Kerala State Board', type: 'education' }
            ],

            // Verifier View Message
            verifierMessage: 'This student record is valid and currently active as per USDI database.'
        }
    ],

    // Initialize data in localStorage (force refresh to sync with code changes)
    init: function () {
        // Always update students to ensure latest data from code is used
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultStudents));

        if (!localStorage.getItem(this.INSTITUTION_KEY)) {
            localStorage.setItem(this.INSTITUTION_KEY, JSON.stringify(this.defaultInstitution));
        }

        // Initialize edit requests if not present
        if (!localStorage.getItem(this.REQUESTS_KEY)) {
            localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(this.defaultEditRequests || []));
        }
    },

    // Get all students
    getAllStudents: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    },

    // Get student by USN
    getStudentByUSN: function (usn) {
        const students = this.getAllStudents();
        return students.find(s => s.usn.toUpperCase() === usn.toUpperCase());
    },

    // Get student by mobile
    getStudentByMobile: function (mobile) {
        const students = this.getAllStudents();
        return students.find(s => s.mobile === mobile);
    },

    // Generate new USN
    generateUSN: function () {
        const students = this.getAllStudents();
        const year = new Date().getFullYear();
        let maxNum = 0;

        students.forEach(s => {
            const match = s.usn.match(/USDI(\d{4})(\d{3})/);
            if (match && parseInt(match[1]) === year) {
                maxNum = Math.max(maxNum, parseInt(match[2]));
            }
        });

        return `USDI${year}${String(maxNum + 1).padStart(3, '0')}`;
    },

    // Add new student
    addStudent: function (studentData) {
        const students = this.getAllStudents();
        const newStudent = {
            ...studentData,
            usn: this.generateUSN(),
            createdAt: new Date().toISOString().split('T')[0],
            academicHistory: [
                {
                    date: new Date().toISOString().split('T')[0],
                    event: `Admitted to ${studentData.course}`,
                    type: 'admission'
                }
            ]
        };

        students.push(newStudent);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
        return newStudent;
    },

    // Update student
    updateStudent: function (usn, updates) {
        const students = this.getAllStudents();
        const index = students.findIndex(s => s.usn === usn);

        if (index !== -1) {
            // Add history entry for status change
            if (updates.status && updates.status !== students[index].status) {
                const historyEntry = {
                    date: new Date().toISOString().split('T')[0],
                    event: this.getStatusChangeMessage(updates.status),
                    type: updates.status.toLowerCase()
                };
                students[index].academicHistory.unshift(historyEntry);
            }

            // Add history entry for semester change
            if (updates.semesterYear && updates.semesterYear !== students[index].semesterYear) {
                const historyEntry = {
                    date: new Date().toISOString().split('T')[0],
                    event: `Enrolled in ${updates.semesterYear}`,
                    type: 'enrollment'
                };
                students[index].academicHistory.unshift(historyEntry);
            }

            students[index] = { ...students[index], ...updates };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
            return students[index];
        }
        return null;
    },

    // Get status change message
    getStatusChangeMessage: function (status) {
        const messages = {
            'Active': 'Student status updated to Active',
            'Graduated': 'Student has Graduated',
            'Transferred': 'Student has been Transferred',
            'Discontinued': 'Student has Discontinued studies'
        };
        return messages[status] || `Status changed to ${status}`;
    },

    // Get statistics
    getStats: function () {
        const students = this.getAllStudents();
        return {
            total: students.length,
            active: students.filter(s => s.status === 'Active').length,
            graduated: students.filter(s => s.status === 'Graduated').length,
            transferred: students.filter(s => s.status === 'Transferred').length,
            discontinued: students.filter(s => s.status === 'Discontinued').length
        };
    },

    // Get institution data
    getInstitution: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.INSTITUTION_KEY));
    },

    // Verify institution admin
    verifyAdmin: function (username, password) {
        const institution = this.getInstitution();
        return institution.adminUser === username && institution.adminPass === password;
    },

    // Verify student (for verifier portal)
    verifyStudent: function (usn) {
        const student = this.getStudentByUSN(usn);
        if (student) {
            return {
                verified: true,
                data: {
                    fullName: student.fullName,
                    usn: student.usn,
                    institution: student.institution,
                    course: student.course,
                    semesterYear: student.semesterYear,
                    status: student.status
                }
            };
        }
        return { verified: false, data: null };
    },

    // ============ EDIT REQUEST MANAGEMENT ============

    REQUESTS_KEY: 'usdi_edit_requests',

    // Default sample edit requests
    defaultEditRequests: [
        {
            id: 'REQ001',
            usn: 'USDI2024001',
            studentName: 'Rahul Sharma',
            requestDate: '2026-01-18',
            description: 'Request to update SSLC board name from "CBSE" to "State Board"',
            status: 'pending',
            changes: {
                'SSLC Board': { old: 'CBSE', new: 'Kerala State Board' }
            }
        },
        {
            id: 'REQ002',
            usn: 'USDI2024002',
            studentName: 'Priya Patel',
            requestDate: '2026-01-19',
            description: 'Request to correct date of birth',
            status: 'pending',
            changes: {
                'dateOfBirth': { old: '2001-11-22', new: '2001-11-12' }
            }
        }
    ],

    // Get all edit requests
    getEditRequests: function () {
        let requests = localStorage.getItem(this.REQUESTS_KEY);
        if (!requests) {
            localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(this.defaultEditRequests));
            return this.defaultEditRequests;
        }
        return JSON.parse(requests);
    },

    // Add new edit request (from student)
    addEditRequest: function (usn, studentName, description, changes) {
        const requests = this.getEditRequests();
        const newRequest = {
            id: 'REQ' + String(requests.length + 1).padStart(3, '0'),
            usn: usn,
            studentName: studentName,
            requestDate: new Date().toISOString().split('T')[0],
            description: description,
            status: 'pending',
            changes: changes
        };
        requests.push(newRequest);
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
        return newRequest;
    },

    // Process edit request (approve/reject)
    processEditRequest: function (requestId, action, adminNotes) {
        const requests = this.getEditRequests();
        const index = requests.findIndex(r => r.id === requestId);

        if (index !== -1) {
            requests[index].status = action; // 'approved' or 'rejected'
            requests[index].processedDate = new Date().toISOString().split('T')[0];
            requests[index].adminNotes = adminNotes || '';

            // If approved, apply the changes
            if (action === 'approved' && requests[index].changes) {
                const updates = {};
                for (const [key, value] of Object.entries(requests[index].changes)) {
                    updates[key] = value.new;
                }
                this.updateStudent(requests[index].usn, updates);
            }

            localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
            return true;
        }
        return false;
    },

    // Reset to default data
    reset: function () {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultStudents));
        localStorage.setItem(this.INSTITUTION_KEY, JSON.stringify(this.defaultInstitution));
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(this.defaultEditRequests));
    }
};

// Initialize on load
USDI_DATA.init();

