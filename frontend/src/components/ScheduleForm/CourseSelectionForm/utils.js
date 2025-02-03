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
    const result = await fetch("http://127.0.0.1:5000/courses/W25").then(
      (response) => response.json()
    );
    return result.courses || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};