import React from "react";
import { Box, Flex, Text, Strong, Link } from "@radix-ui/themes";

const FAQ = () => {
  const questions = [
    {
      question: "What schools can I use this for?",
      answer: "As of right now we only support Vanier College courses.",
    },
    {
      question: "Where can I see my courses?",
      answer:
        "You will need to login into your Omnivox. From there you will need to go to > Services > Progression Chart.",
    },
    {
      question: "Where can I see the courses offered by the school?",
      answer: "You can see them ",
      link: "https://vanierlivecourseschedule.powerappsportals.com/",
    },
    {
      question: "What are course sections?",
      answer:
        "A course section is a specific course with a set teacher and schedule. When entering your courses, you can choose to specify a section, this ensures that no other sections are considered when trying to make your schedule. A common example would be to pick out a specific gym course (ex: 109-102-MQ, section 00019, Volleyball).",
    },
    {
      question: "What is an intensive?",
      answer:
        "An intensive is a gym course involves an activity done outside of the school's campus. Some examples are Cross-Country Skiing or Mountain Biking. These intensive courses will have meeting dates which can occur on weekends. Please note that intensive courses can also incur extra cost.",
    },
    {
      question: "Why were no schedules found?",
      answer:
        "This can happen when the courses you entered do not have any possible combination that fit in the schedule. This can also happen if you chose to have a specific day off in your preferences, and no combination of courses allow you to have that day off. You will need to choose a different set of courses and/or change your schedule preferences.",
    },
    {
      question:
        "The schedules that were generated for me aren't any good and don't fit with the preferences I chose.",
      answer:
        "It is important to understand that there are only a set amount of courses offered per semester. It is often impossible to make a perfect schedule that check all of the boxes. That being said, there are some things you can do to make sure you can improve your schedules and choose the best one. The most important one is to limit the preferences you pick. The less preferences you choose, the better we will be able to accomadate the ones you decided to go for.",
    },
  ];
  return (
    <Flex ml="9" pl="9" mt="9" direction="column">
      {questions.map((question) => {
        return (
          <Box ml="5" mt="6">
            <Text size="7">
              <Strong>• {question.question}</Strong>
            </Text>
            <br></br>
            <Box mt="5" mb="9" ml="9" width="70vw">
              <Text size="5">{question.answer}</Text>
              {question?.link ? (
                <Link size="5" weight="medium" href={question.link}>
                  Here
                </Link>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
};

export default FAQ;
