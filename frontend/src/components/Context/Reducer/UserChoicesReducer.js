import ACTIONS from "./Actions";

const userChoicesReducer = (userChoices, action) => {
    switch (action.type) {
      case ACTIONS.addCourse:
        return {
          ...userChoices,
          courses: [...userChoices.courses, action.payload],
        };
  
      case ACTIONS.deleteCourse:
        return {
          ...userChoices,
          courses: userChoices.courses.filter(
            (course) => course.id !== action.payload
          ),
        };
  
      case ACTIONS.submitForm:
        const specificCourses = [];
        const courses = [];
        const preferences = {
          breaks: userChoices.preferences.breaks.value,
          time: userChoices.preferences.time.value,
          dayOff: userChoices.preferences.dayOff.value,
          intensive: userChoices.preferences.intensive.value,
        };
  
        // Separate specifc and general courses
        userChoices.courses.forEach((course) => {
          course.sectionInput?.length > 0
            ? specificCourses.push({
                course_id: course.id,
                section: course.sectionValue,
              })
            : courses.push(course.id);
        });
  
        return { courses, specificCourses, preferences };
  
      case ACTIONS.updateSection:
        return {
          ...userChoices,
          courses: userChoices.courses.map((course, index) =>
            index == action.payload.index
              ? {
                  id: course.id,
                  sectionInput: action.payload.input,
                  sectionValue: action.payload.value,
                }
              : course
          ),
        };
      case ACTIONS.updatePreferences:
        const updatedPreference = action.payload.updatedPreference;
        const value = action.payload.value;
        const index = action.payload.index
        return {
          ...userChoices,
          preferences: {...userChoices.preferences, [updatedPreference]: {input: String(updatedPreference == "intensive" ? value : index), value: value}}
        };
    }
  };

  export default userChoicesReducer