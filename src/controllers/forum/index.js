import ForumModel from "../../model/forum/index.js";

export const publishQuestion = async (req, res) => {
  const newForum = new ForumModel(req.body);
  try {
    await newForum.save();
    res.status(200).json(newForum);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await ForumModel.find()
      .populate("userId") // Include the associated user data
      .populate("answers.user") // Include the associated user data for answers
      .sort({ createdAt: "desc" }) // Sort by descending order of createdAt field
      .exec();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const answer = async (req, res) => {
  try {
    const { answer, forumId, userId } = req.body;
    const answers = {
      user: userId,
      answer,
    };
    const question = await ForumModel.findById(forumId);
    question.answers.push(answers);
    await question.save();
    res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export const getAllAnswersByForumId = async (req, res) => {
  try {
    const { forumId } = req.body;

    const forum = await ForumModel.findById(forumId)
      .populate({
        path: "answers.user",
      })
      .exec();

    const answers = forum.answers;

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedForum = await ForumModel.findByIdAndDelete(id);
    if (!deletedForum) {
      res.status(404).json({ message: "Forum not found" });
      return;
    }
    res.status(200).json({ message: "Forum deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};
