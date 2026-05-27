/****************************************************
 MCPS ADMIN EDITABLE PORTAL BACKEND
 Google Apps Script + Google Sheets + Google Drive

 FRONTEND WEB APP URL CURRENTLY BEING USED:
 https://script.google.com/macros/s/AKfycbxHibLCuGOMGcTsWPhev7IAjI1CVV8G5y5sQRDQlFRhp_jWVgjxU5UOyWGBgF7Bxh8L/exec

 SETUP:
 1. Google Sheet > Extensions > Apps Script
 2. Delete old Code.gs
 3. Paste this entire file
 4. Save
 5. Run setupPortalDatabase()
 6. Run repairCreatorAccess()
 7. Deploy as Web App:
    - Execute as: Me
    - Who has access: Anyone
 8. Copy the /exec Web App URL into your portal HTML API_URL line if needed.
****************************************************/

const SHEET_ID = "1788MsJmTVBcoYaZj0xvNYUuSstU0axeafFGcL8-TkEc";

const CREATOR_NAME = "Antonio Siller";
const CREATOR_ADMIN_CODE = "9981";
const CREATOR_VIEWER_NAME = "Antonio Siller Viewer";
const CREATOR_VIEWER_CODE = "9982";

const DEFAULT_SECTIONS = [
  {
    id: 1,
    title: "Brand Identity",
    owner: "Antonio Siller",
    department: "Ownership",
    pct: 75,
    desc: "Logo, colors, typography, brand voice, and visual rules.",
    subsections: [
      "1.1 Logo System",
      "1.2 Color Palette",
      "1.3 Typography",
      "1.4 Tagline",
      "1.5 Brand Voice",
      "1.6 Photo Style",
      "1.7 Brand Sentence",
      "1.8 Feeling We Create"
    ],
    folderId: "1VdS0M8TWQFDDDSPDjuV7q9ULyOS6Eod3"
  },
  {
    id: 2,
    title: "Documents",
    owner: "Mauricio Rebaza",
    department: "Admin & Finance",
    pct: 50,
    desc: "Contracts, proposals, invoices, service forms, and templates.",
    subsections: [
      "2.1 Invoice",
      "2.2 Proposal / Quote",
      "2.3 Contract / Service Agreement",
      "2.4 Service Report",
      "2.5 Document Standards",
      "2.6 Document Guidelines",
      "2.7 Why It Matters"
    ],
    folderId: "1stE5DNQ9oj--olQzOBVGCmh4399k4R_6"
  },
  {
    id: 3,
    title: "Online Presence & Digital Communication",
    owner: "Sales Lead",
    department: "Sales & Marketing",
    pct: 0,
    desc: "Website, Google Business, social media, reviews, and digital communication.",
    subsections: [
      "3.1 Digital Brand Standards",
      "3.2 Email Signature System",
      "3.3 Company Email Branding",
      "3.4 Customer Text Message System",
      "3.5 Phone & Voicemail Standardization",
      "3.6 CRM / Client Portal Communication",
      "3.7 Billing Communication System",
      "3.8 Website & Online Presence",
      "3.9 Online Platform Management",
      "3.10 Customer Journey Messaging",
      "3.11 Review & Reputation Communication",
      "3.12 Automation & Internal Control"
    ],
    folderId: "12uGCilPAgo7HlLMHheIo_mG6UdR1Wlml"
  },
  {
    id: 4,
    title: "Internal Systems & Team Operations",
    owner: "Antonio Siller",
    department: "Ownership",
    pct: 55,
    desc: "Software, scheduling, file storage, training, SOPs, and internal communication.",
    subsections: [
      "4.1 Organizational Structure",
      "4.2 SOP System",
      "4.3 Training & Onboarding",
      "4.4 Daily Pre-Service Checklist",
      "4.5 Technician Service Checklist",
      "4.6 Communication Protocols",
      "4.7 Quality Control Process",
      "4.8 Performance & Accountability",
      "4.9 Document Library",
      "4.10 Core Value"
    ],
    folderId: "1MszHvXA6PMx8VhQnyLhqa7cjTFcz1Wt1"
  },
  {
    id: 5,
    title: "Operations & Field Work",
    owner: "Arath Silva",
    department: "Operations",
    pct: 50,
    desc: "Service checklists, route flow, equipment logs, truck setup, and safety protocols.",
    subsections: [
      "5.1 Operational Principles",
      "5.2 Truck Setup & Organization",
      "5.3 Standard Bucket System",
      "5.4 Tool Organization",
      "5.5 Chemical Storage in a Truck",
      "5.6 On-Site Setup",
      "5.7 Clean-up & Final Check",
      "5.8 Service Flow - Every Visit",
      "5.9 Equipment Maintenance",
      "5.10 PPE & Safety",
      "5.11 Winterizing / Closing",
      "5.12 Daily Startup Checklist",
      "5.13 Daily Shutdown Checklist",
      "5.14 Quality Standards"
    ],
    folderId: "1xANwEtLyS8JfisNK65p2LwZUrJkoWAbf"
  },
  {
    id: 6,
    title: "Customer Experience",
    owner: "Admin Asst.",
    department: "Administration",
    pct: 0,
    desc: "Booking, updates, follow-ups, complaints, reviews, and customer journey.",
    subsections: [
      "6.1 Experience Promise",
      "6.2 New Customer Journey",
      "6.3 Customer Communication Flow",
      "6.4 Service Visit Experience",
      "6.5 Customer Portal",
      "6.6 Service Report",
      "6.7 Problem Resolution Process",
      "6.8 Reviews & Testimonials",
      "6.9 Special Occasions",
      "6.10 Customer Retention System",
      "6.11 After Hours & Emergency Process",
      "6.12 Customer Experience Standards"
    ],
    folderId: "12Aw9L3PQs2qw-DmWEdGukAnuvkAhESnX"
  },
  {
    id: 7,
    title: "Physical Appearance",
    owner: "Antonio Siller",
    department: "Ownership",
    pct: 30,
    desc: "Uniforms, truck wraps, signage, equipment appearance, and branded presentation.",
    subsections: [
      "7.1 Physical Brand Standard",
      "7.2 Vehicle Branding",
      "7.3 Uniforms & Apparel",
      "7.4 Employee ID & Accessories",
      "7.5 Storage Room Setup",
      "7.6 Branded Equipment & Supplies",
      "7.7 Tool Organization",
      "7.8 Customer-Facing Presentation",
      "7.9 Vendor & Production Setup",
      "7.10 Physical Asset Inventory"
    ],
    folderId: "1BIAkDooxfmn5kVcaCiKhcuf8iZ4-4ZUg"
  },
  {
    id: 8,
    title: "Marketing Materials",
    owner: "Sales Lead",
    department: "Sales & Marketing",
    pct: 50,
    desc: "Flyers, ads, content, promotions, sales collateral, and print materials.",
    subsections: [
      "8.1 Brand Standards",
      "8.2 Core Business Information",
      "8.3 Content & Message Checklist",
      "8.4 Photo & Visual Asset Checklist",
      "8.5 Business Card Checklist",
      "8.6 Flyer Checklist",
      "8.7 Door Hanger Checklist",
      "8.8 Yard Sign Checklist",
      "8.9 Expo Banner Checklist",
      "8.10 Brochure Checklist",
      "8.11 Referral Card Checklist",
      "8.12 QR Code Checklist",
      "8.13 Seasonal Promo Postcard Checklist",
      "8.14 Estimate Packet Folder Checklist",
      "8.15 Consistent Design Elements Checklist",
      "8.16 Printing & Production Checklist",
      "8.17 Distribution & Usage Checklist",
      "8.18 Performance / Follow-Up Checklist"
    ],
    folderId: "1qeH6DF4U7ZN87zy9WxOPeJmyjIpYuTBI"
  }
];

const DEFAULT_TEAMS = ["Ownership", "Sales & Marketing", "Operations", "Admin & Finance", "Administration"];
const DEFAULT_DEPARTMENTS = ["Ownership", "Sales & Marketing", "Operations", "Admin & Finance", "Administration", "Customer Experience", "Marketing", "Field Work"];
const DEFAULT_FILE_GROUPS = ["Templates", "Working Documents", "Needs Revision", "Approved Final Documents", "Archived Versions"];
const DEFAULT_DOCUMENT_TYPES = ["Master Template", "Example Document", "Reference", "Working File", "Final Version"];
const DEFAULT_ACTION_TYPES = [
  { value: "read", label: "Read only" },
  { value: "fill", label: "Fill out / edit response" },
  { value: "review", label: "Review" },
  { value: "upload", label: "Upload completed version" },
  { value: "approve", label: "Sign / approve" }
];

const HEADERS = {
  Users: ["User ID", "Name", "Email", "Role", "Team", "Department", "Active", "Access Code", "Created At"],
  Sessions: ["Session Token", "User ID", "Name", "Role", "Created At", "Expires At", "Active"],
  Sections: ["Section ID", "Title", "Owner", "Department", "Progress", "Description", "Subsections", "Folder ID", "Active", "Updated At"],
  Options: ["Option Type", "Value", "Label", "Active", "Updated At"],
  Settings: ["Setting Key", "Setting Value", "Updated At"],
  Assignments: [
    "Assignment ID", "Section ID", "Section", "Subsection", "Department", "Document Name", "Assigned To",
    "Due Date", "Status", "Instructions", "Required Action", "Document Type", "File Group",
    "Assignment File URL", "Assignment File ID", "Submitted File URL", "Submitted File ID", "Viewer Notes",
    "Admin Notes", "Read At", "Submitted At", "Approved At", "Created At", "Updated At"
  ],
  UploadLog: ["Timestamp", "Assignment ID", "Submitted By", "Section", "Subsection", "Department", "Document Name", "Upload Type", "File Name", "File URL", "Folder Path", "Status"],
  ActivityLog: ["Timestamp", "User", "Action", "Assignment ID", "Section", "Subsection", "Notes"],
  FolderMap: ["Timestamp", "Section", "Workflow Folder", "Subsection", "Folder ID", "Folder URL", "Path"],
  ErrorLog: ["Timestamp", "Error Message", "Stack"]
};

/****************************************************
 WEB APP ENTRY
****************************************************/
function doGet(e) {
  const action = e && e.parameter && e.parameter.action ? e.parameter.action : "ping";
  try {
    if (action === "setup") {
      setupPortalDatabase();
      return jsonResponse({ success: true, message: "Setup completed." });
    }
    return jsonResponse({
      success: true,
      message: "MCPS Admin Editable Portal API is running.",
      time: new Date()
    });
  } catch (error) {
    logError(error);
    return jsonResponse({ success: false, message: error.message, stack: error.stack || "" });
  }
}

function doPost(e) {
  try {
    const data = parsePostData(e);
    const action = data.action || data.actionName || "";

    if (action === "login") return jsonResponse(loginUser(data));
    if (action === "logout") return jsonResponse(logoutUser(data));

    if (action === "setupPortalDatabase") {
      setupPortalDatabase();
      return jsonResponse({ success: true, message: "Setup completed." });
    }

    if (action === "getPortalData") return jsonResponse(getPortalDataForLoggedInUser(data));

    if (action === "saveLogo") { requireAdmin(data); return jsonResponse(saveLogo(data)); }
    if (action === "saveSections") { requireAdmin(data); return jsonResponse(saveSections(data)); }
    if (action === "saveOptions") { requireAdmin(data); return jsonResponse(saveOptions(data)); }
    if (action === "saveUsers") { requireAdmin(data); return jsonResponse(saveUsers(data)); }
    if (action === "addUser") { requireAdmin(data); return jsonResponse(addUser(data)); }
    if (action === "createAssignment") { requireAdmin(data); return jsonResponse(createAssignment(data)); }
    if (action === "markRead") { requireLogin(data); return jsonResponse(markRead(data)); }
    if (action === "submitWork") { requireLogin(data); return jsonResponse(submitWork(data)); }
    if (action === "approveAssignment") { requireAdmin(data); return jsonResponse(updateAssignmentStatus(data, "Approved")); }
    if (action === "requestRevision") { requireAdmin(data); return jsonResponse(updateAssignmentStatus(data, "Needs Revision")); }

    throw new Error("Unknown action: " + action);
  } catch (error) {
    logError(error);
    return jsonResponse({ success: false, message: error.message, stack: error.stack || "" });
  }
}

function parsePostData(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

/****************************************************
 SETUP
****************************************************/
function setupPortalDatabase() {
  getOrCreateSheet("Users", HEADERS.Users);
  getOrCreateSheet("User Sessions", HEADERS.Sessions);
  getOrCreateSheet("Sections", HEADERS.Sections);
  getOrCreateSheet("Options", HEADERS.Options);
  getOrCreateSheet("Settings", HEADERS.Settings);
  getOrCreateSheet("Assignments", HEADERS.Assignments);
  getOrCreateSheet("Upload Log", HEADERS.UploadLog);
  getOrCreateSheet("Activity Log", HEADERS.ActivityLog);
  getOrCreateSheet("Folder Map", HEADERS.FolderMap);
  getOrCreateSheet("Error Log", HEADERS.ErrorLog);
  seedUsers();
  seedSections();
  seedOptions();
  seedSettings();
  setupFolders();
  repairCreatorAccess();
  return true;
}

function seedUsers() {
  const sheet = getOrCreateSheet("Users", HEADERS.Users);
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ["user_creator_admin", "Antonio Siller", "antonio@example.com", "Admin", "Ownership", "Ownership", "TRUE", CREATOR_ADMIN_CODE, new Date()],
    ["user_creator_viewer", "Antonio Siller Viewer", "antonio.viewer@example.com", "Viewer", "Viewer Test", "Viewer Test", "TRUE", CREATOR_VIEWER_CODE, new Date()],
    ["user_viewer_1", "Mauricio Rebaza", "mauricio@example.com", "Viewer", "Admin & Finance", "Admin & Finance", "TRUE", "8827", new Date()],
    ["user_viewer_2", "Arath Silva", "arath@example.com", "Viewer", "Operations", "Operations", "TRUE", "4412", new Date()],
    ["user_viewer_3", "Sales Lead", "sales@example.com", "Viewer", "Sales & Marketing", "Sales & Marketing", "TRUE", "7722", new Date()],
    ["user_viewer_4", "Admin Asst.", "admin@example.com", "Viewer", "Administration", "Administration", "TRUE", "6633", new Date()]
  ];
  sheet.getRange(2, 1, rows.length, HEADERS.Users.length).setValues(rows);
}

function seedSections() {
  const sheet = getOrCreateSheet("Sections", HEADERS.Sections);
  if (sheet.getLastRow() > 1) return;
  const rows = DEFAULT_SECTIONS.map(s => [
    s.id, s.title, s.owner, s.department, s.pct, s.desc,
    JSON.stringify(s.subsections || []), s.folderId, "TRUE", new Date()
  ]);
  sheet.getRange(2, 1, rows.length, HEADERS.Sections.length).setValues(rows);
}

function seedOptions() {
  const sheet = getOrCreateSheet("Options", HEADERS.Options);
  if (sheet.getLastRow() > 1) return;
  const rows = [];
  DEFAULT_TEAMS.forEach(v => rows.push(["teams", v, v, "TRUE", new Date()]));
  DEFAULT_DEPARTMENTS.forEach(v => rows.push(["departments", v, v, "TRUE", new Date()]));
  DEFAULT_FILE_GROUPS.forEach(v => rows.push(["fileGroups", v, v, "TRUE", new Date()]));
  DEFAULT_DOCUMENT_TYPES.forEach(v => rows.push(["documentTypes", v, v, "TRUE", new Date()]));
  DEFAULT_ACTION_TYPES.forEach(a => rows.push(["actionOptions", a.value, a.label, "TRUE", new Date()]));
  sheet.getRange(2, 1, rows.length, HEADERS.Options.length).setValues(rows);
}

function seedSettings() {
  const sheet = getOrCreateSheet("Settings", HEADERS.Settings);
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ["companyName", "Mission Custom Pool Solutions", new Date()],
    ["tagline", "Clean Pools. Done Right.", new Date()],
    ["logoDataUrl", "", new Date()],
    ["apiUrl", "https://script.google.com/macros/s/AKfycbxHibLCuGOMGcTsWPhev7IAjI1CVV8G5y5sQRDQlFRhp_jWVgjxU5UOyWGBgF7Bxh8L/exec", new Date()]
  ];
  sheet.getRange(2, 1, rows.length, HEADERS.Settings.length).setValues(rows);
}

/****************************************************
 LOGIN / SESSIONS
****************************************************/
function loginUser(data) {
  const name = String(data.name || "").trim();
  const accessCode = String(data.accessCode || "").trim();
  if (!name || !accessCode) throw new Error("Name and access code are required.");

  if (name.toLowerCase() === CREATOR_NAME.toLowerCase() && accessCode === CREATOR_ADMIN_CODE) {
    repairCreatorAccess();
    return createSession({
      "User ID": "user_creator_admin",
      Name: CREATOR_NAME,
      Role: "Admin",
      Team: "Ownership",
      Department: "Ownership",
      Email: "antonio@example.com"
    });
  }

  if (name.toLowerCase() === CREATOR_VIEWER_NAME.toLowerCase() && accessCode === CREATOR_VIEWER_CODE) {
    repairCreatorAccess();
    return createSession({
      "User ID": "user_creator_viewer",
      Name: CREATOR_VIEWER_NAME,
      Role: "Viewer",
      Team: "Viewer Test",
      Department: "Viewer Test",
      Email: "antonio.viewer@example.com"
    });
  }

  const users = readSheetObjects("Users");
  const user = users.find(u =>
    String(u.Name).trim().toLowerCase() === name.toLowerCase() &&
    String(u["Access Code"]).trim() === accessCode &&
    String(u.Active).toUpperCase() !== "FALSE"
  );
  if (!user) throw new Error("Invalid login. Check your name or access code.");
  return createSession(user);
}

function createSession(user) {
  const token = Utilities.getUuid() + "_" + Utilities.getUuid();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 12);
  getOrCreateSheet("User Sessions", HEADERS.Sessions).appendRow([
    token, user["User ID"], user.Name, user.Role, createdAt, expiresAt, "TRUE"
  ]);
  return {
    success: true,
    sessionToken: token,
    user: {
      userId: user["User ID"],
      name: user.Name,
      role: user.Role,
      team: user.Team || "",
      department: user.Department || "",
      email: user.Email || ""
    }
  };
}

function logoutUser(data) {
  const token = String(data.sessionToken || "").trim();
  if (!token) return { success: true };
  const sheet = getOrCreateSheet("User Sessions", HEADERS.Sessions);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const tokenCol = headers.indexOf("Session Token");
  const activeCol = headers.indexOf("Active");
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][tokenCol]) === token) {
      sheet.getRange(i + 1, activeCol + 1).setValue("FALSE");
      break;
    }
  }
  return { success: true };
}

function getCurrentSession(data) {
  const token = String(data.sessionToken || "").trim();
  if (!token) throw new Error("Not logged in.");
  const sessions = readSheetObjects("User Sessions");
  const session = sessions.find(s =>
    String(s["Session Token"]) === token &&
    String(s.Active).toUpperCase() !== "FALSE"
  );
  if (!session) throw new Error("Session expired. Please log in again.");
  if (new Date(session["Expires At"]) < new Date()) throw new Error("Session expired. Please log in again.");
  return session;
}

function requireLogin(data) {
  return getCurrentSession(data);
}

function requireAdmin(data) {
  const session = getCurrentSession(data);
  if (String(session.Name).trim().toLowerCase() === CREATOR_NAME.toLowerCase()) return session;
  if (String(session.Role) !== "Admin") throw new Error("Admin access required.");
  return session;
}

function repairCreatorAccess() {
  const sheet = getOrCreateSheet("Users", HEADERS.Users);
  const users = readSheetObjects("Users");
  const adminExists = users.some(u => String(u.Name).trim().toLowerCase() === CREATOR_NAME.toLowerCase());
  const viewerExists = users.some(u => String(u.Name).trim().toLowerCase() === CREATOR_VIEWER_NAME.toLowerCase());
  if (!adminExists) sheet.appendRow(["user_creator_admin", CREATOR_NAME, "antonio@example.com", "Admin", "Ownership", "Ownership", "TRUE", CREATOR_ADMIN_CODE, new Date()]);
  if (!viewerExists) sheet.appendRow(["user_creator_viewer", CREATOR_VIEWER_NAME, "antonio.viewer@example.com", "Viewer", "Viewer Test", "Viewer Test", "TRUE", CREATOR_VIEWER_CODE, new Date()]);

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const nameCol = headers.indexOf("Name");
  const roleCol = headers.indexOf("Role");
  const activeCol = headers.indexOf("Active");
  const codeCol = headers.indexOf("Access Code");
  for (let i = 1; i < values.length; i++) {
    const row = i + 1;
    const name = String(values[i][nameCol]).trim().toLowerCase();
    if (name === CREATOR_NAME.toLowerCase()) {
      sheet.getRange(row, roleCol + 1).setValue("Admin");
      sheet.getRange(row, activeCol + 1).setValue("TRUE");
      sheet.getRange(row, codeCol + 1).setValue(CREATOR_ADMIN_CODE);
    }
    if (name === CREATOR_VIEWER_NAME.toLowerCase()) {
      sheet.getRange(row, roleCol + 1).setValue("Viewer");
      sheet.getRange(row, activeCol + 1).setValue("TRUE");
      sheet.getRange(row, codeCol + 1).setValue(CREATOR_VIEWER_CODE);
    }
  }
  return true;
}

/****************************************************
 DATA
****************************************************/
function getPortalDataForLoggedInUser(data) {
  const session = getCurrentSession(data);
  const allAssignments = readSheetObjects("Assignments");
  const isAdmin = String(session.Role) === "Admin" || String(session.Name).trim().toLowerCase() === CREATOR_NAME.toLowerCase();
  const assignments = isAdmin
    ? allAssignments
    : allAssignments.filter(a => String(a["Assigned To"]) === String(session.Name));

  return {
    success: true,
    user: { name: session.Name, role: session.Role, userId: session["User ID"] },
    settings: getSettingsObject(),
    sections: getSectionsForPortal(),
    options: getOptionsObject(),
    users: isAdmin ? readSheetObjects("Users") : [],
    assignments,
    uploads: isAdmin ? readSheetObjects("Upload Log") : [],
    activity: isAdmin ? readSheetObjects("Activity Log") : [],
    projectStructure: getProjectStructureForLegacyPortal(),
    serverTime: new Date()
  };
}

function getSettingsObject() {
  const rows = readSheetObjects("Settings");
  const obj = {};
  rows.forEach(r => { obj[r["Setting Key"]] = r["Setting Value"]; });
  return obj;
}

function getSectionsForPortal() {
  const rows = readSheetObjects("Sections");
  return rows
    .filter(r => String(r.Active).toUpperCase() !== "FALSE")
    .map(r => ({
      id: Number(r["Section ID"]),
      title: r.Title,
      owner: r.Owner,
      department: r.Department || "",
      pct: Number(r.Progress || 0),
      desc: r.Description || "",
      subsections: safeJsonArray(r.Subsections),
      folderId: r["Folder ID"] || ""
    }));
}

function getProjectStructureForLegacyPortal() {
  const structure = {};
  getSectionsForPortal().forEach(section => {
    structure[section.id + ". " + section.title] = section.subsections || [];
  });
  return structure;
}

function getOptionsObject() {
  const rows = readSheetObjects("Options").filter(r => String(r.Active).toUpperCase() !== "FALSE");
  const options = { teams: [], departments: [], fileGroups: [], documentTypes: [], actionOptions: [] };
  rows.forEach(r => {
    const type = r["Option Type"];
    if (type === "actionOptions") {
      options.actionOptions.push({ value: r.Value, label: r.Label || r.Value });
    } else if (options[type]) {
      options[type].push(r.Value);
    }
  });
  return options;
}

/****************************************************
 ADMIN EDITING
****************************************************/
function saveLogo(data) {
  setSetting("logoDataUrl", data.logoDataUrl || "");
  logActivity(getCurrentSession(data).Name, "Updated logo", "", "", "", "Logo updated");
  return { success: true, message: "Logo saved." };
}

function saveSections(data) {
  const sections = data.sections || [];
  const sheet = getOrCreateSheet("Sections", HEADERS.Sections);
  clearDataRows(sheet);
  const rows = sections.map(s => [
    Number(s.id), s.title || "", s.owner || "", s.department || "", Number(s.pct || 0),
    s.desc || "", JSON.stringify(s.subsections || []), s.folderId || "", "TRUE", new Date()
  ]);
  if (rows.length) sheet.getRange(2, 1, rows.length, HEADERS.Sections.length).setValues(rows);
  logActivity(getCurrentSession(data).Name, "Saved portal sections", "", "", "", "Sections updated");
  return { success: true, message: "Sections saved." };
}

function saveOptions(data) {
  const options = data.options || {};
  const sheet = getOrCreateSheet("Options", HEADERS.Options);
  clearDataRows(sheet);
  const rows = [];
  (options.teams || []).forEach(v => rows.push(["teams", v, v, "TRUE", new Date()]));
  (options.departments || []).forEach(v => rows.push(["departments", v, v, "TRUE", new Date()]));
  (options.fileGroups || []).forEach(v => rows.push(["fileGroups", v, v, "TRUE", new Date()]));
  (options.documentTypes || []).forEach(v => rows.push(["documentTypes", v, v, "TRUE", new Date()]));
  (options.actionOptions || []).forEach(a => rows.push(["actionOptions", a.value, a.label, "TRUE", new Date()]));
  if (rows.length) sheet.getRange(2, 1, rows.length, HEADERS.Options.length).setValues(rows);
  logActivity(getCurrentSession(data).Name, "Saved portal options", "", "", "", "Teams, departments, file groups, document types, and actions updated");
  return { success: true, message: "Options saved." };
}

function saveUsers(data) {
  const users = data.users || [];
  const sheet = getOrCreateSheet("Users", HEADERS.Users);
  clearDataRows(sheet);
  const cleaned = [];
  const seen = {};

  users.forEach(u => {
    const rawName = String(u.name || u.Name || "").trim();
    if (!rawName) return;
    const isAntonio = rawName.toLowerCase() === CREATOR_NAME.toLowerCase();
    const isAntonioViewer = rawName.toLowerCase() === CREATOR_VIEWER_NAME.toLowerCase();
    const name = isAntonio ? CREATOR_NAME : isAntonioViewer ? CREATOR_VIEWER_NAME : rawName;
    const key = name.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    cleaned.push([
      isAntonio ? "user_creator_admin" : isAntonioViewer ? "user_creator_viewer" : (u.userId || u["User ID"] || makeId("user")),
      name,
      u.email || u.Email || "",
      isAntonio ? "Admin" : isAntonioViewer ? "Viewer" : (u.role || u.Role || "Viewer"),
      u.team || u.Team || "",
      u.department || u.Department || "",
      "TRUE",
      isAntonio ? CREATOR_ADMIN_CODE : isAntonioViewer ? CREATOR_VIEWER_CODE : String(u.accessCode || u["Access Code"] || ""),
      u.createdAt || u["Created At"] || new Date()
    ]);
  });

  if (!seen[CREATOR_NAME.toLowerCase()]) cleaned.unshift(["user_creator_admin", CREATOR_NAME, "antonio@example.com", "Admin", "Ownership", "Ownership", "TRUE", CREATOR_ADMIN_CODE, new Date()]);
  if (!seen[CREATOR_VIEWER_NAME.toLowerCase()]) cleaned.push(["user_creator_viewer", CREATOR_VIEWER_NAME, "antonio.viewer@example.com", "Viewer", "Viewer Test", "Viewer Test", "TRUE", CREATOR_VIEWER_CODE, new Date()]);
  if (cleaned.length) sheet.getRange(2, 1, cleaned.length, HEADERS.Users.length).setValues(cleaned);
  logActivity(getCurrentSession(data).Name, "Saved users", "", "", "", "Users and access codes updated");
  return { success: true, message: "Users saved." };
}

function addUser(data) {
  const session = requireAdmin(data);
  const name = String(data.name || "").trim();
  const accessCode = String(data.accessCode || "").trim();
  if (!name) throw new Error("Name is required.");
  if (!accessCode) throw new Error("Access code is required.");
  const userId = data.userId || makeId("user");
  getOrCreateSheet("Users", HEADERS.Users).appendRow([
    userId, name, data.email || "", data.role === "Admin" ? "Admin" : "Viewer",
    data.team || "", data.department || "", "TRUE", accessCode, new Date()
  ]);
  logActivity(session.Name, "Added user", "", "", "", name);
  return { success: true, userId };
}

/****************************************************
 ASSIGNMENTS
****************************************************/
function createAssignment(data) {
  const session = requireAdmin(data);
  const assignmentId = data.assignmentId || makeId("assignment");
  const sectionId = Number(data.sectionId || data.sectionID || "");
  let section = findSectionById(sectionId);
  if (!section && data.section) section = findSectionByTitle(data.section);
  if (!section) throw new Error("Section not found. Check the section/category selected in the portal.");

  const sectionName = section.title;
  const subsection = data.subsection || "General";
  const documentName = data.documentName || data.title || "Untitled Assignment";
  const assignedTo = data.assignedTo || "";
  const department = data.department || section.department || "";
  if (!assignedTo) throw new Error("Assigned To is required.");

  let assignmentFileUrl = "";
  let assignmentFileId = "";
  if (data.fileData) {
    const destination = getDestinationFolder(section, subsection, documentName, assignedTo, "Assigned Documents");
    const file = saveFileFromBase64(destination.folder, data.fileData, data.fileName || documentName, data.mimeType || "application/octet-stream");
    assignmentFileUrl = file.getUrl();
    assignmentFileId = file.getId();
    logUpload({
      assignmentId,
      submittedBy: session.Name,
      section: sectionName,
      subsection,
      department,
      documentName,
      uploadType: "Assigned Documents",
      fileName: data.fileName || documentName,
      fileUrl: assignmentFileUrl,
      folderPath: destination.path,
      status: "Assigned"
    });
  }

  getOrCreateSheet("Assignments", HEADERS.Assignments).appendRow([
    assignmentId, section.id, sectionName, subsection, department, documentName, assignedTo, data.dueDate || "",
    "Assigned", data.instructions || "", data.requiredAction || "read", data.documentType || "Working File",
    data.fileGroup || "Working Documents", assignmentFileUrl, assignmentFileId, "", "", "", "", "", "", "",
    new Date(), new Date()
  ]);
  logActivity(session.Name, "Created assignment", assignmentId, sectionName, subsection, documentName);
  return { success: true, assignmentId, message: "Assignment created." };
}

function markRead(data) {
  const session = requireLogin(data);
  const info = findAssignment(data.assignmentId);
  if (!info) throw new Error("Assignment not found.");
  if (String(session.Role) !== "Admin" && String(info.data["Assigned To"]) !== String(session.Name)) throw new Error("You do not have access to this assignment.");
  updateAssignment(data.assignmentId, { "Status": "Read", "Read At": new Date(), "Updated At": new Date() });
  logActivity(session.Name, "Marked as read", data.assignmentId, info.data.Section, info.data.Subsection, info.data["Document Name"]);
  return { success: true, message: "Marked as read." };
}

function submitWork(data) {
  const session = requireLogin(data);
  const info = findAssignment(data.assignmentId);
  if (!info) throw new Error("Assignment not found.");
  if (String(session.Role) !== "Admin" && String(info.data["Assigned To"]) !== String(session.Name)) throw new Error("You do not have access to this assignment.");
  if (!data.fileData) throw new Error("No file data received.");

  let sectionObj = findSectionById(Number(info.data["Section ID"]));
  if (!sectionObj) sectionObj = findSectionByTitle(info.data.Section);
  if (!sectionObj) throw new Error("Section folder ID is missing for this assignment.");

  const sectionName = info.data.Section;
  const subsection = info.data.Subsection;
  const documentName = info.data["Document Name"];
  const department = info.data.Department || "";
  const viewerName = session.Name || info.data["Assigned To"] || "Unknown Viewer";
  const destination = getDestinationFolder(sectionObj, subsection, documentName, viewerName, "Submitted Work");
  const file = saveFileFromBase64(destination.folder, data.fileData, data.fileName || "Submitted Work", data.mimeType || "application/octet-stream");
  updateAssignment(data.assignmentId, {
    "Status": "In Review",
    "Submitted File URL": file.getUrl(),
    "Submitted File ID": file.getId(),
    "Viewer Notes": data.notes || "",
    "Submitted At": new Date(),
    "Updated At": new Date()
  });
  logUpload({
    assignmentId: data.assignmentId,
    submittedBy: viewerName,
    section: sectionName,
    subsection,
    department,
    documentName,
    uploadType: "Submitted Work",
    fileName: data.fileName || "Submitted Work",
    fileUrl: file.getUrl(),
    folderPath: destination.path,
    status: "Waiting on Approval"
  });
  logActivity(viewerName, "Submitted work", data.assignmentId, sectionName, subsection, documentName);
  return { success: true, message: "Submitted work.", fileUrl: file.getUrl(), folderPath: destination.path };
}

function updateAssignmentStatus(data, status) {
  const session = requireAdmin(data);
  const info = findAssignment(data.assignmentId);
  if (!info) throw new Error("Assignment not found.");
  const fields = { "Status": status, "Admin Notes": data.adminNotes || "", "Updated At": new Date() };
  if (status === "Approved") fields["Approved At"] = new Date();
  updateAssignment(data.assignmentId, fields);
  logActivity(session.Name, status, data.assignmentId, info.data.Section, info.data.Subsection, info.data["Document Name"]);
  return { success: true, message: "Status updated to " + status };
}

/****************************************************
 DRIVE
****************************************************/
function setupFolders() {
  const mapSheet = getOrCreateSheet("Folder Map", HEADERS.FolderMap);
  const existing = getExistingFolderPaths();
  const sections = getSectionsForPortal();
  sections.forEach(section => {
    if (!section.folderId) return;
    const sectionFolder = DriveApp.getFolderById(section.folderId);
    ["Assigned Documents", "Submitted Work", "Approved Final", "Needs Revision", "Archived Versions"].forEach(workflow => {
      const workflowFolder = getOrCreateChildFolder(sectionFolder, workflow);
      (section.subsections || []).forEach(subsection => {
        const subFolder = getOrCreateChildFolder(workflowFolder, subsection);
        const path = section.title + " / " + workflow + " / " + subsection;
        if (!existing[path]) {
          mapSheet.appendRow([new Date(), section.title, workflow, subsection, subFolder.getId(), subFolder.getUrl(), path]);
        }
      });
    });
  });
}

function getExistingFolderPaths() {
  const rows = readSheetObjects("Folder Map");
  const map = {};
  rows.forEach(r => { if (r.Path) map[r.Path] = true; });
  return map;
}

function getDestinationFolder(section, subsection, assignmentName, viewerName, uploadType) {
  if (!section || !section.folderId) throw new Error("Section folder ID is missing.");
  let folder = DriveApp.getFolderById(section.folderId);
  folder = getOrCreateChildFolder(folder, uploadType);
  folder = getOrCreateChildFolder(folder, subsection);
  folder = getOrCreateChildFolder(folder, assignmentName);
  let path = section.title + " / " + uploadType + " / " + subsection + " / " + assignmentName;
  if (uploadType === "Submitted Work") {
    folder = getOrCreateChildFolder(folder, viewerName);
    path += " / " + viewerName;
  }
  return { folder, path };
}

function getOrCreateChildFolder(parent, name) {
  const safe = cleanName(name);
  const folders = parent.getFoldersByName(safe);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(safe);
}

function saveFileFromBase64(folder, base64, fileName, mimeType) {
  const cleanBase64 = String(base64).includes(",") ? String(base64).split(",")[1] : String(base64);
  const decoded = Utilities.base64Decode(cleanBase64);
  const blob = Utilities.newBlob(decoded, mimeType, fileName);
  return folder.createFile(blob);
}

/****************************************************
 SHEETS
****************************************************/
function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return sheet;
  }
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers.forEach(header => {
    if (!currentHeaders.includes(header)) sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
  });
  return sheet;
}

function readSheetObjects(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values
    .filter(row => row.some(cell => cell !== ""))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function clearDataRows(sheet) {
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
}

function findSectionById(sectionId) {
  return getSectionsForPortal().find(s => Number(s.id) === Number(sectionId));
}

function findSectionByTitle(title) {
  const raw = String(title || "").trim().toLowerCase().replace(/^\d+\.\s*/, "");
  return getSectionsForPortal().find(s => String(s.title || "").trim().toLowerCase() === raw || String(s.id + ". " + s.title).trim().toLowerCase() === String(title || "").trim().toLowerCase());
}

function findAssignment(assignmentId) {
  const sheet = getOrCreateSheet("Assignments", HEADERS.Assignments);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(assignmentId)) {
      const data = {};
      headers.forEach((h, col) => { data[h] = values[i][col]; });
      return { row: i + 1, data };
    }
  }
  return null;
}

function updateAssignment(assignmentId, fields) {
  const sheet = getOrCreateSheet("Assignments", HEADERS.Assignments);
  const info = findAssignment(assignmentId);
  if (!info) throw new Error("Assignment not found.");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(fields).forEach(field => {
    const col = headers.indexOf(field) + 1;
    if (col > 0) sheet.getRange(info.row, col).setValue(fields[field]);
  });
}

function setSetting(key, value) {
  const sheet = getOrCreateSheet("Settings", HEADERS.Settings);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(key)) {
      sheet.getRange(i + 1, 2).setValue(value);
      sheet.getRange(i + 1, 3).setValue(new Date());
      return;
    }
  }
  sheet.appendRow([key, value, new Date()]);
}

function logUpload(data) {
  getOrCreateSheet("Upload Log", HEADERS.UploadLog).appendRow([
    new Date(), data.assignmentId || "", data.submittedBy || "", data.section || "", data.subsection || "",
    data.department || "", data.documentName || "", data.uploadType || "", data.fileName || "",
    data.fileUrl || "", data.folderPath || "", data.status || ""
  ]);
}

function logActivity(user, action, assignmentId, section, subsection, notes) {
  getOrCreateSheet("Activity Log", HEADERS.ActivityLog).appendRow([
    new Date(), user || "", action || "", assignmentId || "", section || "", subsection || "", notes || ""
  ]);
}

function logError(error) {
  const sheet = getOrCreateSheet("Error Log", HEADERS.ErrorLog);
  sheet.appendRow([new Date(), error.message || String(error), error.stack || ""]);
}

/****************************************************
 UTILITY
****************************************************/
function safeJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return String(value || "").split(",").map(x => x.trim()).filter(Boolean);
  }
}

function cleanName(name) {
  return String(name || "General")
    .trim()
    .replace(/[\\\/:*?"<>|#%{}~&]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "General";
}

function makeId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
