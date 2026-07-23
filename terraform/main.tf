provider "aws" {
  region = "us-east-1"
}

module "ec2" {
  source = "./ec2"
  sg_names = module.sg.sg_names
}

module "eip" {
  source = "./eip"
  instance_id = module.ec2.instance_id
}

module "sg" {
  source = "./sg"
}

output "fleetch_ip" {
  value = module.eip.web_server_ip
}