import { Table } from 'antd';
import React from 'react';
import { Question } from '../../../components/QuestionList/Question.type';
import QuestionInfo from './QuestionInfo';

interface TutorTableProps {
    questions: Question[];
    onReload: () => void;
}

const QuestionTable: React.FC<TutorTableProps> = ({ questions, onReload }) => {
    const columns = [
        {
            title: 'No',
            key: 'index',
            dataIndex: 'id',
            render: (_:unknown, __ :unknown, index:number) => index + 1,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Subject',
            dataIndex: 'subjectName',
            key: 'subject',
        },
        {
            title: 'Uploaded by',
            key: 'fullName',
            render: (record: Question) => record.account.fullName
        },
        {
            title: 'Email',
            key: 'email',
            render: (record: Question) => record.account.email
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: Question) => (
                <>
                <QuestionInfo question={record} onReload={onReload} />
                </>
            )
        }
    ];
    return (
        <div>
            <Table rowKey={'id'} columns={columns} dataSource={questions} />;
        </div>
    );
}

export default QuestionTable;