import React, { useState, useContext } from 'react';
import styles from './Manager.module.scss';
import Button from 'components/Button';
import { usePermissions, Can, Switch as PermissionsSwitch } from 'Permissions';

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

  const { permissions } = usePermissions();

  return (
    <div className={styles.container}>
      <h1>Manager</h1>
      <ul className={styles.posts}>
        {posts.map(post => (
          <li className={styles.post} key={post.id}>
            <div className={styles.post_title}>
              {post.title}
            </div>
            {/* TODO: Only render this for users that are allowed to delete posts */}
            <div className={styles.post_buttons}>
              <PermissionsSwitch>
                <Can permissions={["user:write"]}>
                  <Button palette="danger" onClick={() => remove(post.id)}>
                    Delete
                  </Button>
                </Can>
                <Can>
                  <Button>
                    View
                  </Button>
                </Can>
                <Can>
                  <Button>
                    View
                  </Button>
                </Can>
              </PermissionsSwitch>
              {/* {permissions.includes('user:write') && (
                  <Button palette="danger" onClick={() => remove(post.id)}>
                  Delete
                  </Button>
                  )} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Manager;
