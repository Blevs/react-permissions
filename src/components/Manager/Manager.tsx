import React, { useState } from 'react';
import { Switch as PermissionsSwitch, Can } from 'Permissions';
import styles from './Manager.module.scss';
import Button from 'components/Button';

const Manager = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'This is a post on a service' },
    { id: 2, title: 'A second post? It will shock you' },
    { id: 3, title: 'What even are these' },
    { id: 4, title: 'This is the last one' },
    { id: 5, title: 'I lied' },
  ]);

  const remove = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1>Manager</h1>
      <ul className={styles.posts}>
        {posts.map(post => (
          <li className={styles.post} key={post.id}>
            <div className={styles.post_title}>
              {post.title}
            </div>
            <Can permissions="user:write">
              <div className={styles.post_buttons}>
                <Button palette="danger" onClick={() => remove(post.id)}>
                  Delete
                </Button>
              </div>
            </Can>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Manager;
