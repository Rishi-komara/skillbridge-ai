const roleSkills = {
  // =====================================================
  // CSE & ALLIED BRANCHES
  // =====================================================

  "Software Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Java", "Python", "JavaScript"],
      Core: [
        "Data Structures",
        "Algorithms",
        "OOP",
        "Git",
      ],
      Database: ["SQL"],
      Development: ["REST API"],
    },
  },

  "Full Stack Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Frontend: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
      ],
      Backend: [
        "Node",
        "Express",
        "REST API",
      ],
      Database: [
        "SQL",
        "MySQL",
        "MongoDB",
      ],
      Core: [
        "Git",
        "Data Structures",
        "Algorithms",
      ],
    },
  },

  "Frontend Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Frontend: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Tailwind",
      ],
      Core: [
        "Git",
        "REST API",
        "Data Structures",
      ],
    },
  },

  "Backend Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Java", "JavaScript"],
      Backend: [
        "Node",
        "Express",
        "REST API",
      ],
      Database: [
        "SQL",
        "MySQL",
        "MongoDB",
      ],
      Core: [
        "Git",
        "Data Structures",
        "Algorithms",
      ],
    },
  },

  "Java Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Java"],
      Backend: [
        "Spring",
        "Spring Boot",
        "REST API",
      ],
      Database: ["SQL", "MySQL"],
      Core: [
        "Git",
        "Data Structures",
        "Algorithms",
      ],
    },
  },

  "Python Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Python"],
      Backend: [
        "Django",
        "Flask",
        "REST API",
      ],
      Database: ["SQL", "MySQL"],
      Core: [
        "Git",
        "Data Structures",
        "Algorithms",
      ],
    },
  },

  "Mobile App Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Java", "JavaScript"],
      Mobile: [
        "Android",
        "React Native",
      ],
      Backend: ["REST API"],
      Database: ["SQL"],
      Core: ["Git", "Data Structures"],
    },
  },

  "Data Analyst": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Python"],
      Database: ["SQL"],
      Analytics: [
        "Excel",
        "Power BI",
        "Pandas",
        "Data Visualization",
        "Statistics",
      ],
    },
  },

  "Data Scientist": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Python"],
      Data: [
        "Pandas",
        "NumPy",
        "Data Visualization",
      ],
      MachineLearning: [
        "Machine Learning",
        "Scikit-learn",
      ],
      Core: [
        "Statistics",
        "SQL",
        "Git",
      ],
    },
  },

  "AI Engineer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Python"],
      AI: [
        "Machine Learning",
        "Deep Learning",
        "NLP",
      ],
      Libraries: [
        "TensorFlow",
        "PyTorch",
      ],
      Core: [
        "Data Structures",
        "Git",
        "SQL",
      ],
    },
  },

  "Machine Learning Engineer": {
    branch: "CSE & Allied Branches",
    categories: {
      Programming: ["Python"],
      MachineLearning: [
        "Machine Learning",
        "Deep Learning",
        "Scikit-learn",
      ],
      Libraries: [
        "TensorFlow",
        "PyTorch",
        "Pandas",
        "NumPy",
      ],
      Core: ["Git", "SQL"],
    },
  },

  "Cloud Engineer": {
    branch: "CSE & Allied Branches",
    categories: {
      Cloud: [
        "AWS",
        "Azure",
        "Cloud Computing",
      ],
      DevOps: [
        "Docker",
        "Linux",
        "CI/CD",
      ],
      Networking: ["Computer Networks"],
      Core: ["Git"],
    },
  },

  "DevOps Engineer": {
    branch: "CSE & Allied Branches",
    categories: {
      DevOps: [
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Jenkins",
      ],
      Cloud: ["AWS"],
      Systems: ["Linux"],
      Core: ["Git"],
    },
  },

  "Cybersecurity Analyst": {
    branch: "CSE & Allied Branches",
    categories: {
      Security: [
        "Cyber Security",
        "Network Security",
        "Web Security",
      ],
      Networking: [
        "Computer Networks",
        "TCP/IP",
      ],
      Systems: ["Linux"],
      Programming: ["Python"],
    },
  },

  "QA / Test Engineer": {
    branch: "CSE & Allied Branches",
    categories: {
      Testing: [
        "Software Testing",
        "Manual Testing",
        "Automation Testing",
        "Selenium",
      ],
      Programming: ["Java"],
      Core: [
        "SQL",
        "Git",
        "REST API",
      ],
    },
  },

  "Database Developer": {
    branch: "CSE & Allied Branches",
    categories: {
      Database: [
        "SQL",
        "MySQL",
        "MongoDB",
        "Database Design",
      ],
      Programming: ["Java"],
      Core: ["Git"],
    },
  },

  // =====================================================
  // ECE
  // =====================================================

  "Embedded Systems Engineer": {
    branch: "ECE",
    categories: {
      Programming: ["C", "C++"],
      Embedded: [
        "Embedded Systems",
        "Microcontrollers",
        "Embedded C",
      ],
      Electronics: [
        "Digital Electronics",
        "Analog Electronics",
      ],
      Communication: [
        "UART",
        "SPI",
        "I2C",
      ],
    },
  },

  "VLSI Engineer": {
    branch: "ECE",
    categories: {
      VLSI: [
        "VLSI",
        "Verilog",
        "SystemVerilog",
      ],
      Electronics: [
        "Digital Electronics",
        "CMOS",
      ],
      Design: [
        "RTL Design",
        "Timing Analysis",
      ],
    },
  },

  "FPGA Engineer": {
    branch: "ECE",
    categories: {
      FPGA: [
        "FPGA",
        "Verilog",
        "VHDL",
        "RTL Design",
      ],
      Electronics: [
        "Digital Electronics",
      ],
      Tools: ["Vivado"],
    },
  },

  "IoT Engineer": {
    branch: "ECE",
    categories: {
      Programming: ["C", "Python"],
      IoT: [
        "IoT",
        "Arduino",
        "Raspberry Pi",
        "Sensors",
      ],
      Communication: [
        "MQTT",
        "Bluetooth",
        "Wi-Fi",
      ],
      Embedded: ["Microcontrollers"],
    },
  },

  "Telecommunication Engineer": {
    branch: "ECE",
    categories: {
      Communication: [
        "Communication Systems",
        "Wireless Communication",
        "Digital Communication",
      ],
      Networking: [
        "Computer Networks",
        "TCP/IP",
      ],
      Core: [
        "Signal Processing",
        "RF",
      ],
    },
  },

  "Electronics Engineer": {
    branch: "ECE",
    categories: {
      Electronics: [
        "Analog Electronics",
        "Digital Electronics",
        "Electronic Circuits",
      ],
      Embedded: [
        "Microcontrollers",
        "Embedded Systems",
      ],
      Design: ["PCB Design"],
    },
  },

  "PCB Design Engineer": {
    branch: "ECE",
    categories: {
      Design: [
        "PCB Design",
        "Circuit Design",
        "Schematic Design",
      ],
      Electronics: [
        "Analog Electronics",
        "Digital Electronics",
      ],
      Tools: ["KiCad"],
    },
  },

  "Signal Processing Engineer": {
    branch: "ECE",
    categories: {
      SignalProcessing: [
        "Signal Processing",
        "Digital Signal Processing",
      ],
      Programming: ["Python", "MATLAB"],
      Core: [
        "Communication Systems",
        "Signals and Systems",
      ],
    },
  },

  // =====================================================
  // EEE
  // =====================================================

  "Electrical Engineer": {
    branch: "EEE",
    categories: {
      Electrical: [
        "Electrical Machines",
        "Power Systems",
        "Circuit Analysis",
      ],
      Core: [
        "Power Electronics",
        "Control Systems",
      ],
      Tools: ["MATLAB"],
    },
  },

  "Power Systems Engineer": {
    branch: "EEE",
    categories: {
      Power: [
        "Power Systems",
        "Power Generation",
        "Power Transmission",
        "Power Distribution",
      ],
      Electrical: [
        "Electrical Machines",
        "Protection Systems",
      ],
      Tools: ["MATLAB"],
    },
  },

  "Control Systems Engineer": {
    branch: "EEE",
    categories: {
      Control: [
        "Control Systems",
        "PLC",
        "SCADA",
        "Automation",
      ],
      Electrical: [
        "Electrical Machines",
      ],
      Programming: ["MATLAB"],
    },
  },

  "Electrical Design Engineer": {
    branch: "EEE",
    categories: {
      Design: [
        "Electrical Design",
        "Circuit Design",
        "AutoCAD",
      ],
      Electrical: [
        "Power Systems",
        "Electrical Machines",
      ],
      Core: ["Electrical Safety"],
    },
  },

  "Electrical Maintenance Engineer": {
    branch: "EEE",
    categories: {
      Maintenance: [
        "Preventive Maintenance",
        "Troubleshooting",
        "Electrical Safety",
      ],
      Electrical: [
        "Electrical Machines",
        "Power Systems",
      ],
      Industrial: ["PLC"],
    },
  },

  "Renewable Energy Engineer": {
    branch: "EEE",
    categories: {
      Renewable: [
        "Solar Energy",
        "Wind Energy",
        "Renewable Energy",
      ],
      Electrical: [
        "Power Systems",
        "Power Electronics",
      ],
      Core: ["Energy Management"],
    },
  },

  // =====================================================
  // MECHANICAL
  // =====================================================

  "Mechanical Design Engineer": {
    branch: "Mechanical",
    categories: {
      Design: [
        "AutoCAD",
        "SolidWorks",
        "CAD",
      ],
      Core: [
        "Engineering Drawing",
        "Machine Design",
        "Mechanics",
      ],
    },
  },

  "CAD Engineer": {
    branch: "Mechanical",
    categories: {
      Design: [
        "CAD",
        "AutoCAD",
        "SolidWorks",
      ],
      Core: [
        "Engineering Drawing",
        "Machine Design",
      ],
    },
  },

  "Manufacturing Engineer": {
    branch: "Mechanical",
    categories: {
      Manufacturing: [
        "Manufacturing Processes",
        "CNC",
        "Lean Manufacturing",
      ],
      Quality: [
        "Quality Control",
        "Six Sigma",
      ],
      Core: ["Engineering Drawing"],
    },
  },

  "Production Engineer": {
    branch: "Mechanical",
    categories: {
      Production: [
        "Production Planning",
        "Manufacturing Processes",
        "Lean Manufacturing",
      ],
      Quality: ["Quality Control"],
      Core: [
        "Industrial Engineering",
        "Safety",
      ],
    },
  },

  "Mechanical Quality Engineer": {
    branch: "Mechanical",
    categories: {
      Quality: [
        "Quality Control",
        "Quality Assurance",
        "Six Sigma",
      ],
      Manufacturing: [
        "Manufacturing Processes",
      ],
      Core: [
        "Engineering Drawing",
        "Measurement",
      ],
    },
  },

  "Automobile Engineer": {
    branch: "Mechanical",
    categories: {
      Automobile: [
        "Automobile Engineering",
        "IC Engines",
        "Vehicle Dynamics",
      ],
      Design: ["CAD"],
      Core: [
        "Thermodynamics",
        "Machine Design",
      ],
    },
  },

  "Mechanical Maintenance Engineer": {
    branch: "Mechanical",
    categories: {
      Maintenance: [
        "Preventive Maintenance",
        "Troubleshooting",
        "Condition Monitoring",
      ],
      Core: [
        "Mechanical Systems",
        "Safety",
      ],
    },
  },

  // =====================================================
  // CIVIL
  // =====================================================

  "Civil Engineer": {
    branch: "Civil",
    categories: {
      Core: [
        "Structural Engineering",
        "Surveying",
        "Construction Management",
      ],
      Design: ["AutoCAD"],
      Materials: [
        "Concrete Technology",
        "Building Materials",
      ],
    },
  },

  "Structural Engineer": {
    branch: "Civil",
    categories: {
      Structural: [
        "Structural Analysis",
        "RCC Design",
        "Steel Design",
      ],
      Design: ["AutoCAD", "STAAD Pro"],
      Core: ["Engineering Mechanics"],
    },
  },

  "Site Engineer": {
    branch: "Civil",
    categories: {
      Construction: [
        "Site Management",
        "Construction Planning",
        "Quantity Estimation",
      ],
      Core: [
        "Surveying",
        "Building Materials",
        "Safety",
      ],
      Design: ["AutoCAD"],
    },
  },

  "Quantity Surveyor": {
    branch: "Civil",
    categories: {
      Estimation: [
        "Quantity Estimation",
        "Cost Estimation",
        "BOQ",
      ],
      Construction: [
        "Construction Management",
      ],
      Tools: ["Excel", "AutoCAD"],
    },
  },

  "BIM Engineer": {
    branch: "Civil",
    categories: {
      BIM: [
        "BIM",
        "Revit",
        "Navisworks",
      ],
      Design: ["AutoCAD"],
      Core: [
        "Construction Management",
      ],
    },
  },

  "Construction Engineer": {
    branch: "Civil",
    categories: {
      Construction: [
        "Construction Management",
        "Project Planning",
        "Site Management",
      ],
      Core: [
        "Surveying",
        "Safety",
      ],
      Tools: ["AutoCAD"],
    },
  },

  "Civil Planning Engineer": {
    branch: "Civil",
    categories: {
      Planning: [
        "Project Planning",
        "Scheduling",
        "Primavera",
      ],
      Construction: [
        "Construction Management",
      ],
      Tools: ["Excel"],
    },
  },

  // =====================================================
  // CHEMICAL
  // =====================================================

  "Chemical Engineer": {
    branch: "Chemical",
    categories: {
      Core: [
        "Chemical Engineering",
        "Mass Transfer",
        "Heat Transfer",
        "Thermodynamics",
      ],
      Process: [
        "Process Engineering",
        "Process Control",
      ],
      Safety: ["Industrial Safety"],
    },
  },

  "Process Engineer": {
    branch: "Chemical",
    categories: {
      Process: [
        "Process Engineering",
        "Process Design",
        "Process Control",
      ],
      Core: [
        "Mass Transfer",
        "Heat Transfer",
        "Thermodynamics",
      ],
      Safety: ["Process Safety"],
    },
  },

  "Chemical Production Engineer": {
    branch: "Chemical",
    categories: {
      Production: [
        "Production Planning",
        "Process Operations",
      ],
      Process: [
        "Process Engineering",
        "Process Control",
      ],
      Safety: [
        "Industrial Safety",
        "Process Safety",
      ],
    },
  },

  "Chemical Quality Control Engineer": {
    branch: "Chemical",
    categories: {
      Quality: [
        "Quality Control",
        "Quality Assurance",
      ],
      Laboratory: [
        "Chemical Analysis",
        "Laboratory Testing",
      ],
      Core: ["Process Engineering"],
    },
  },

  "Process Safety Engineer": {
    branch: "Chemical",
    categories: {
      Safety: [
        "Process Safety",
        "Industrial Safety",
        "Risk Assessment",
        "HAZOP",
      ],
      Process: [
        "Process Engineering",
        "Process Control",
      ],
    },
  },
};

export default roleSkills;