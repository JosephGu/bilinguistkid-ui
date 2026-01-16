import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { getUserList } from "@/app/actions/admin";

const AdminPage = async () => {
  const userList = await getUserList();
  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <Box sx={{ margin: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary">
          Add User
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.nickname || "-"}</TableCell>
              <TableCell>{user.birthday?.toLocaleDateString() || "-"}</TableCell>
              <TableCell>{user.createdAt?.toLocaleDateString() || "-"}</TableCell>
              <TableCell>{user.updatedAt?.toLocaleDateString() || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminPage;
