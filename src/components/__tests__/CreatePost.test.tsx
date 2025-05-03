import { render, screen, fireEvent } from "@testing-library/react";
import CreatePost from "../CreatePost";
import { useUser } from "@clerk/nextjs";
import { createPost } from "@/actions/post.action";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/actions/post.action", () => ({
  createPost: jest.fn(),
}));

describe("CreatePost Component", () => {
  it("renders the component", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { imageUrl: "/avatar.png" } });

    render(<CreatePost />);
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
  });

  it("submits a post", async () => {
    (useUser as jest.Mock).mockReturnValue({ user: { imageUrl: "/avatar.png" } });
    (createPost as jest.Mock).mockResolvedValue({ success: true });

    render(<CreatePost />);

    const textarea = screen.getByPlaceholderText("What's on your mind?");
    const button = screen.getByText("Post");

    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    fireEvent.click(button);

    expect(createPost).toHaveBeenCalledWith("Hello, world!", "");
  });
});
