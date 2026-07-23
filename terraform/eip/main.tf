variable "instance_id" {
  type = string
  description = "EC2 instance ID to attach EIP to"
}

resource "aws_eip" "web_server_eip" {
  instance = var.instance_id
}

output "web_server_ip" {
  value = aws_eip.web_server_eip.public_ip
  description = "Public IP of EIP"
}