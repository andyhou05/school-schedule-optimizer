import { Flex, Em, Link, Text, Button } from "@radix-ui/themes";
import TeacherDialog from "./TeacherDialog";
import "../styles/styles.css";

const CourseCell = ({ courseCellInformation, teacherRatingsData }) => {
  return (
    <td className="course-cell" rowSpan={courseCellInformation.duration}>
      <Flex direction="column">
        <Text size="2" weight="medium">
          <Em>{courseCellInformation.name}</Em>
        </Text>
        <Text
          style={{ fontSize: "10px" }}
        >{`${courseCellInformation.courseId} sec. ${courseCellInformation.section}`}</Text>
        <TeacherDialog
          teacher={teacherRatingsData[courseCellInformation.teacherId]}
        >
          <Button variant="outline" style={{ height: "100%", marginTop: "5%" }}>
            <Text weight="medium" style={{ color: "blue" }}>
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
