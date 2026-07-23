variable "sg_names" {
  type = list(string)
  description = "List of Security Group names"
}

resource "aws_instance" "web_server" {
  ami = "ami-01edba92f9036f76e"
  instance_type = "t3.micro"
  security_groups = var.sg_names
  tags = {
    Name = "fleetch-server"
  }
}

output "instance_id" {
  value = aws_instance.web_server.id
  description = "EC2 instance id"
}