variable "ingress_ports" {
  type = list(number)
  default = [443, 80]
}

variable "egress_ports" {
  type = list(number)
  default = [443, 80]
}

resource "aws_security_group" "web_server_sg" {
  name = "Allow HTTP/HTTPS"
  dynamic "ingress" {
    iterator = port
    for_each = var.ingress_ports
    content {
      from_port = port.value
      to_port = port.value
      protocol = "TCP"
      cidr_blocks = ["0.0.0.0/0"] 
    }
  }
  dynamic "egress" {
    iterator = port
    for_each = var.egress_ports
    content {
      from_port = port.value
      to_port = port.value
      protocol = "TCP"
      cidr_blocks = ["0.0.0.0/0"] 
    }
  }
}

output "sg_names" {
  value = [aws_security_group.web_server_sg.name]
  description = "List of Security Group names"
}