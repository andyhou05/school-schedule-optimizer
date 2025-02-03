export const validateSection = (coursesData, courseInput) => {
    return !courseInput.sectionValue?.length
      ? true
      : coursesData.some(
          (course) =>
            course.courseId == courseInput.id &&
            course.section == courseInput.sectionValue
        );
  };