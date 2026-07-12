export type EligibilityCheck = {
  label: string;
  passed: boolean;
  reason: string;
};

export type EligibilityResult = {
  eligible: boolean;
  checks: EligibilityCheck[];
};

export function checkEligibility(
  profile: {
    currentCgpa: number | null;
    backlogs: number | null;
    semester: number | null;
    graduationYear: number | null;
    branch: string | null;
    college: string | null;
    gender: string | null;
  },
  rule: {
    minimumCGPA: number | null;
    maximumBacklogs: number | null;
    minimumSemester: number | null;
    graduationYear: number | null;
    allowedBranches: string[];
    allowedColleges: string[];
    genderRestriction: string | null;
  } | null
): EligibilityResult {
  if (!rule) {
    return { eligible: true, checks: [] };
  }

  const checks: EligibilityCheck[] = [];

  // CGPA check
  if (rule.minimumCGPA !== null) {
    if (profile.currentCgpa === null) {
      checks.push({
        label: "Minimum CGPA",
        passed: false,
        reason: `CGPA not provided; minimum required is ${rule.minimumCGPA}`,
      });
    } else {
      const passed = profile.currentCgpa >= rule.minimumCGPA;
      checks.push({
        label: "Minimum CGPA",
        passed,
        reason: passed
          ? `CGPA ${profile.currentCgpa} meets minimum of ${rule.minimumCGPA}`
          : `CGPA ${profile.currentCgpa} is below minimum of ${rule.minimumCGPA}`,
      });
    }
  }

  // Backlogs check
  if (rule.maximumBacklogs !== null) {
    if (profile.backlogs === null) {
      checks.push({
        label: "Maximum Backlogs",
        passed: false,
        reason: `Backlogs not provided; maximum allowed is ${rule.maximumBacklogs}`,
      });
    } else {
      const passed = profile.backlogs <= rule.maximumBacklogs;
      checks.push({
        label: "Maximum Backlogs",
        passed,
        reason: passed
          ? `${profile.backlogs} backlog(s) within limit of ${rule.maximumBacklogs}`
          : `${profile.backlogs} backlog(s) exceeds limit of ${rule.maximumBacklogs}`,
      });
    }
  }

  // Semester check
  if (rule.minimumSemester !== null) {
    if (profile.semester === null) {
      checks.push({
        label: "Minimum Semester",
        passed: false,
        reason: `Semester not provided; minimum required is ${rule.minimumSemester}`,
      });
    } else {
      const passed = profile.semester >= rule.minimumSemester;
      checks.push({
        label: "Minimum Semester",
        passed,
        reason: passed
          ? `Semester ${profile.semester} meets minimum of ${rule.minimumSemester}`
          : `Semester ${profile.semester} is below minimum of ${rule.minimumSemester}`,
      });
    }
  }

  // Graduation year check
  if (rule.graduationYear !== null) {
    if (profile.graduationYear === null) {
      checks.push({
        label: "Graduation Year",
        passed: false,
        reason: `Graduation year not provided; required year is ${rule.graduationYear}`,
      });
    } else {
      const passed = profile.graduationYear === rule.graduationYear;
      checks.push({
        label: "Graduation Year",
        passed,
        reason: passed
          ? `Graduation year ${profile.graduationYear} matches required year`
          : `Graduation year ${profile.graduationYear} does not match required year ${rule.graduationYear}`,
      });
    }
  }

  // Allowed branches check
  if (rule.allowedBranches.length > 0) {
    if (profile.branch === null) {
      checks.push({
        label: "Allowed Branches",
        passed: false,
        reason: `Branch not provided; allowed branches: ${rule.allowedBranches.join(", ")}`,
      });
    } else {
      const passed = rule.allowedBranches.includes(profile.branch);
      checks.push({
        label: "Allowed Branches",
        passed,
        reason: passed
          ? `Branch "${profile.branch}" is in the allowed list`
          : `Branch "${profile.branch}" is not in the allowed list: ${rule.allowedBranches.join(", ")}`,
      });
    }
  }

  // Allowed colleges check
  if (rule.allowedColleges.length > 0) {
    if (profile.college === null) {
      checks.push({
        label: "Allowed Colleges",
        passed: false,
        reason: `College not provided; allowed colleges: ${rule.allowedColleges.join(", ")}`,
      });
    } else {
      const passed = rule.allowedColleges.includes(profile.college);
      checks.push({
        label: "Allowed Colleges",
        passed,
        reason: passed
          ? `College "${profile.college}" is in the allowed list`
          : `College "${profile.college}" is not in the allowed list: ${rule.allowedColleges.join(", ")}`,
      });
    }
  }

  // Gender restriction check
  if (rule.genderRestriction !== null && rule.genderRestriction !== "ANY") {
    if (profile.gender === null) {
      checks.push({
        label: "Gender Restriction",
        passed: false,
        reason: `Gender not provided; restricted to ${rule.genderRestriction}`,
      });
    } else {
      const passed = profile.gender === rule.genderRestriction;
      checks.push({
        label: "Gender Restriction",
        passed,
        reason: passed
          ? `Gender "${profile.gender}" matches restriction`
          : `Gender "${profile.gender}" does not match restriction "${rule.genderRestriction}"`,
      });
    }
  }

  return {
    eligible: checks.every((c) => c.passed),
    checks,
  };
}
