import { Flex, Em, Link, Text } from "@radix-ui/themes";
import "../styles/styles.css";

const CourseCell = ({ keyProp, courseCellInformation, teacherRatingsData }) => {
  return (
    <td
      key={keyProp}
      className="course-cell"
      rowSpan={courseCellInformation.duration}
    >
      <Flex direction="column">
        <Text size="2" weight="medium">
          <Em>{courseCellInformation.name}</Em>
        </Text>
        <Text
          style={{ fontSize: "10px" }}
        >{`${courseCellInformation.courseId} sec. ${courseCellInformation.section}`}</Text>
        <br></br>
        <Text size="1">
          <Em>
            <Link
              href="#"
              weight="medium"
              style={{ color: "blue" }}
              onClick={(e) => {
                console.log(keyProp);
                e.preventDefault();
              }}
            >
              {`${teacherRatingsData[courseCellInformation.teacherId].name}: ${
                teacherRatingsData[courseCellInformation.teacherId].avgRating
                  ? `${
                      teacherRatingsData[courseCellInformation.teacherId]
                        .avgRating
                    }%`
                  : "N/A"
              }`}
            </Link>
          </Em>
        </Text>
      </Flex>
    </td>
  );
};

export default CourseCell;
