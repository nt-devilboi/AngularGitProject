import {Commit} from "./Commit";
import {Project} from "./Project";
import {RepositoryCommit} from "./RepositoryCommit";

export interface User {
  id: number,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string
}

// как идея. в итоге у этого интерфеса будут все данные
export interface UserAllData {
  id: number,
  username: string,
  name: string,
  avatar_url: string,
  web_url: string
  commits: Commit[]
  projects: Project[]
  RepositoryCommits: RepositoryCommit[]
}
