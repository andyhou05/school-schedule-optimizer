import { Flex, Em, Link, Text, Button } from "@radix-ui/themes";
import TeacherDialog from "./TeacherDialog";
import "../styles/styles.css";

const CourseCell = ({ courseCellInformation, teacherRatingsData }) => {
  return (
    <td
      className="course-cell"
      rowSpan={courseCellInformation.endTime - courseCellInformation.startTime}
    >
      <Flex direction="column">
        <Text size="1" weight="medium">
          <Em>{courseCellInformation.name}</Em>
        </Text>
        {/* Add the following as a clickable {`${courseCellInformation.courseId} sec. ${courseCellInformation.section}`}*/}
        <TeacherDialog
          teacher={teacherRatingsData[courseCellInformation.teacherId]}
        >
          <Button
            variant="ghost"
            style={{ height: "100%", margin: "0", marginTop: "5%" }}
          >
            <Text size="1" weight="medium" style={{ color: "blue" }}>
              <Em>
                {`${
                  teacherRatingsData[courseCellInformation.teacherId].name
                }: ${
                  teacherRatingsData[courseCellInformation.teacherId].avgRating
                    ? `${
                        teacherRatingsData[courseCellInformation.teacherId]
                          .avgRating
                      }%`
                    : "N/A"
                }`}
              </Em>
            </Text>
          </Button>
        </TeacherDialog>
      </Flex>
    </td>
  );
};

export default CourseCell;
