export const validateSection = (coursesData, courseInput) => {
  return !courseInput.sectionValue?.length
    ? true
    : coursesData.some(
        (course) =>
          course.courseId == courseInput.id &&
          course.section == courseInput.sectionValue
      );
};

// Fetch all existing courses for input validation
export const fetchCourseData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/W25`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Removes all white space and makes all characters upper case.
export const sanitizeInput = (input = "") => {
  return input.replace(/\s/g, "").toUpperCase();
};

export const validateCourseId = (coursesData, id) => {
  return coursesData.some((course) => course.courseId == id);
};

export const groupSpecificCourses = (courses) => {
  const specificCourses = [];
  courses.forEach((course) => {
    if (course.sectionInput?.length > 0) {
      specificCourses.push({
        courseId: course.id,
        section: course.sectionValue,
      });
    }
  });
  return { courses: specificCourses };
};

export const checkConflicts = (conflicts, inputCourses) => {
  if (!conflicts.pairs || !inputCourses) return false;

  const courseSet = new Set(
    inputCourses.map((c) => `${c.id}-${c.sectionValue}`)
  );
  return conflicts.pairs.some(
    ([course1, course2]) =>
      courseSet.has(`${course1.courseId}-${course1.section}`) &&
      courseSet.has(`${course2.courseId}-${course2.section}`)
  );
};

export const sendConflictsCheck = async (courses, setIsLoading) => {
  try {
    setIsLoading(true);
    const result = await fetch(
      `${import.meta.env.VITE_API_URL}/check_conflicts`,
      {
        method: "POST",
        body: JSON.stringify(courses),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!result.ok) {
      throw new Error(`HTTP error, ${result.status}`);
    }

    const data = await result.json();
    setIsLoading(false);
    return data;
  } catch (error) {
    console.log(error);
    return Error(error);
  }
};
