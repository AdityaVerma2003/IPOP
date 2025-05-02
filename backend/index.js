import express from 'express';
import cors from 'cors';
import Group from './Models/Group.model.js'
import UserData from './Models/UserData.model.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

import connectDB from './db/dbconfig.js';

connectDB();


// POST endpoint to receive group data
app.post('/api/groups', async (req, res) => {
    try {
      const { groupName, fields, fieldOptions } = req.body;
  
      if (!groupName || !fields || !Array.isArray(fields)) {
        return res.status(400).json({ error: 'Invalid data' });
      }

      //cleaning the field options sepeated by commas
      if (fieldOptions) {
        const optionsArray = fieldOptions.split(',').map(option => option.trim());
        fields.forEach(field => {
          if (field.fieldType === 'select') {
            field.fieldOptions = optionsArray;
          }
        });
      }
  
      const newGroup = new Group({ groupName, fields });
      await newGroup.save();
  
      res.status(201).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.get('/api/groups', async (req, res) => {
    try {
      const groups = await Group.find();
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.post('/api/user', async (req, res) => {
    try {
      const { groupName, entries} = req.body;
  
      if (!groupName || !entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: 'Invalid data' });
      }

      const data = {
        groupName,
        entries: entries.map(entry => ({
          fieldName: entry.fieldName,
          value: entry.value
        }))
      }

      const newUserData = new UserData(data);
      await newUserData.save();
      res.status(201).json({ message: 'Data added successfully', data: data });
    } catch (error) {
      console.error('Error in adding the data', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  