const constants = {
    defaultPassword: '123',
    semesterTypes: {
        one: 'Semester One',
        two: 'Semester Two',
        'special-term-1': 'Special Term One',
        'special-term-2': 'Special Term Two'
    },
    assessmentTypes: {
        quiz: 'Quiz',
        test: 'Test',
        exam: 'Exam'
    },
    questionTypes: {
        multipleChoiceSingleAnswer: {
            label: 'Multiple Choice Single Answer',
            value: 'multiple-choice-single-answer',
        },
        multipleChoiceMultiAnswer: {
            label: 'Multiple Choice Multi Answer',
            value: 'multiple-choice-multi-answer'
        },
        trueOrFalse: {
            label: 'True Or False',
            value: 'true-or-false',
            maxAnswer: 2
        },
        coding: {
            label: 'Coding',
            value: 'coding',
            maxAnswer: 1
        }
    },
    excelStudentKeys: [
        'no',
        'name',
        ['class', 'studentType'],
        'courseType',
        'nationality'
    ]
};

export default constants